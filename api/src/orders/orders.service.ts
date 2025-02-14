import {Injectable, BadRequestException} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {Repository, MoreThanOrEqual} from 'typeorm';
import {Order, OrderStatus, ProductName} from './entities/order.entity';
import {WebhookPayloadDto} from './dto/webhook-payload.dto';
import {v4 as uuidv4} from 'uuid';
import {EmailService} from 'src/email/email.service';

@Injectable()
export class OrdersService {
    private readonly TOTAL_SLOTS_POOL = 3;

    private readonly PRODUCT_SLOT_WEIGHTS = {
        [ProductName.STARTUP_CORE]: 1,
        [ProductName.STARTUP_PLUS]: 2,
        [ProductName.STARTUP_PRO]: 3,
        [ProductName.CICD_INTEGRATION]: 0.5,
        [ProductName.INFRASTRUCTURE_SETUP]: 0.7,
    };

    constructor(
        @InjectRepository(Order)
        private ordersRepository: Repository<Order>,
        private emailService: EmailService,
    ) {
    }

    async processOrder(webhookPayloadDto: WebhookPayloadDto) {
        if (webhookPayloadDto.type !== 'payment_success') {
            throw new BadRequestException('Only successful payments can be processed');
        }

        try {
            const productName = webhookPayloadDto.data.items[0]?.name;
            console.log('Original product name:', productName);

            if (!productName) {
                throw new BadRequestException('Product name is required');
            }

            const order = new Order();
            order.id = uuidv4();
            order.customerEmail = webhookPayloadDto.data.customer.email;
            order.productName = this.mapProductName(productName);
            console.log('Final product name to save:', order.productName);

            order.status = OrderStatus.NEW;
            order.orderDate = new Date(webhookPayloadDto.data.order.createdAt);

            const savedOrder = await this.ordersRepository.save(order);

            try {
                await this.emailService.sendOrderConfirmation(
                    order.customerEmail,
                    order.productName
                );
            } catch (error) {
                console.error('Failed to send order confirmation email:', error);
            }

            return {
                success: true,
                order: savedOrder,
                message: 'Order processed successfully'
            };
        } catch (error) {
            throw new BadRequestException('Failed to process order: ' + error.message);
        }
    }

    private mapProductName(name: string): ProductName {
        const cleanName = name.replace(/\s*\([^)]*\)/, '').trim();
        console.log('Clean name:', cleanName);

        const mapping = {
            'Startup Core': ProductName.STARTUP_CORE,
            'Startup Plus': ProductName.STARTUP_PLUS,
            'Startup Pro': ProductName.STARTUP_PRO,
            'CI/CD Integration': ProductName.CICD_INTEGRATION,
            'Infrastructure Setup': ProductName.INFRASTRUCTURE_SETUP
        };

        const mappedName = mapping[cleanName];
        console.log('Mapped name:', mappedName);

        if (!mappedName) {
            throw new BadRequestException(`Unknown product name: ${name}`);
        }

        return mappedName;
    }

    async getAvailableSlots() {
        const now = new Date();
        const startOfWeek = new Date(now);
        startOfWeek.setHours(0, 0, 0, 0);
        startOfWeek.setDate(now.getDate() - now.getDay() + (now.getDay() === 0 ? -6 : 1));

        const activeOrders = await this.ordersRepository.find({
            where: {
                orderDate: MoreThanOrEqual(startOfWeek),
                status: OrderStatus.NEW
            }
        });

        const usedSlots = activeOrders.reduce((total, order) => {
            return total + this.PRODUCT_SLOT_WEIGHTS[order.productName];
        }, 0);

        const remainingSlots = Math.max(0, this.TOTAL_SLOTS_POOL - usedSlots);

        return Object.values(ProductName).reduce((acc, productName) => {
            const weightForProduct = this.PRODUCT_SLOT_WEIGHTS[productName];
            const availableSlotsForProduct = Math.floor(remainingSlots / weightForProduct);
            acc[productName] = Math.max(0, availableSlotsForProduct);
            return acc;
        }, {});
    }
}