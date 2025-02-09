<template>
  <div class="space-y-6">
    <div class="flex justify-between items-center">
      <h1 class="text-4xl font-bold transform -rotate-2">
        <span class="bg-yellow-300 px-4 py-2 inline-block neo-brutalism">Store</span>
      </h1>
    </div>

    <div class="bg-white p-6 neo-brutalism">
      <div class="flex flex-wrap gap-4 mb-6">
        <button
            v-for="filter in storeFilters"
            :key="filter.value"
            @click="currentFilter = filter.value"
            class="px-4 py-2 neo-brutalism neo-brutalism-hover font-bold"
            :class="[
            currentFilter === filter.value
              ? 'bg-blue-200'
              : 'bg-gray-100 hover:bg-blue-100'
          ]"
        >
          <div class="flex items-center">
            <Icon :icon="filter.icon" class="mr-2 w-5 h-5"/>
            {{ filter.label }}
          </div>
        </button>
      </div>

      <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div v-for="product in filteredProducts"
             :key="product.id"
             class="bg-gray-50 p-6 neo-brutalism hover:bg-blue-50">
          <div class="flex justify-between items-start mb-4">
            <h3 class="text-xl font-bold">{{ product.name }}</h3>
            <div :class="[
              product.popular ? 'bg-green-100' : getTypeConfig(product.type).bgColor,
              'px-3 py-1 neo-brutalism text-sm font-bold'
            ]">
              {{ product.popular ? 'Popular' : getTypeConfig(product.type).label }}
            </div>
          </div>

          <div v-if="product.badge"
               class="bg-yellow-300 text-black w-fit font-bold py-1 px-3 mb-4 neo-brutalism transform rotate-2">
            {{ product.badge }}
          </div>

          <p class="text-gray-600 mb-4">{{ product.description }}</p>

          <div class="space-y-4 mb-6">
            <div v-for="feature in product.features"
                 :key="feature"
                 class="flex items-center gap-2">
              <Icon icon="tabler:check" class="w-5 h-5 text-green-600"/>
              <span>{{ feature }}</span>
            </div>
          </div>

          <div class="flex items-baseline gap-2 mb-6">
            <span class="text-3xl font-bold">${{ product.price }}</span>
            <span v-if="product.originalPrice" class="text-lg line-through text-gray-400">
              ${{ product.originalPrice }}
            </span>
            <span class="text-gray-600">{{ product.billingPeriod }}</span>

          </div>
          <button
              @click="purchaseProduct(product)"
              class="w-full p-3 bg-blue-500 text-white neo-brutalism neo-brutalism-hover font-bold"
          >
            Purchase
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {ref, computed, onMounted} from 'vue';
import {Icon} from '@iconify/vue';

interface Product {
  id: number;
  name: string;
  description: string;
  type: ProductType;
  price: number;
  originalPrice?: number;
  billingPeriod: string;
  features: string[];
  popular: boolean;
  badge?: string;
  fungiesProductId?: string;
}

enum ProductType {
  Subscription = 'subscription',
  TaskPackage = 'taskPackage',
  AppPackage = 'appPackage'
}

const typeConfig = {
  [ProductType.Subscription]: {
    label: 'Subscription',
    icon: 'tabler:refresh',
    bgColor: 'bg-blue-100'
  },
  [ProductType.TaskPackage]: {
    label: 'Task Package',
    icon: 'tabler:package',
    bgColor: 'bg-purple-100'
  },
  [ProductType.AppPackage]: {
    label: 'App Package',
    icon: 'tabler:apps',
    bgColor: 'bg-orange-100'
  }
};

const storeFilters = [
  {label: 'All Products', value: 'all', icon: 'tabler:shopping-cart'},
  {label: 'Subscriptions', value: ProductType.Subscription, icon: 'tabler:refresh'},
  {label: 'Task Packages', value: ProductType.TaskPackage, icon: 'tabler:package'},
  {label: 'App Packages', value: ProductType.AppPackage, icon: 'tabler:apps'}
];

const currentFilter = ref('all');

const products = ref<Product[]>([
  // Subscription Plans
  {
    id: 1,
    name: 'Light Plan',
    description: 'Perfect for occasional development needs',
    type: ProductType.Subscription,
    price: 499,
    billingPeriod: '/month',
    features: [
      '1 active request at a time',
      '1 project',
      '48-72h average delivery',
      'Cancel or pause anytime',
      'Email support'
    ],
    popular: false,
    fungiesProductId: 'light_plan_monthly'
  },
  {
    id: 2,
    name: 'Standard Plan',
    description: 'Ideal for growing companies with regular needs',
    type: ProductType.Subscription,
    price: 999,
    billingPeriod: '/month',
    features: [
      '2 active requests at a time',
      '3 projects',
      '24-48h average delivery',
      'Cancel or pause anytime',
      'Dedicated Slack channel'
    ],
    popular: true,
    fungiesProductId: 'standard_plan_monthly'
  },
  {
    id: 3,
    name: 'Pro Plan',
    description: 'For teams requiring maximum development velocity',
    type: ProductType.Subscription,
    price: 2499,
    billingPeriod: '/month',
    features: [
      '3 active requests at a time',
      'Unlimited projects',
      '24-48h average delivery',
      'Cancel or pause anytime',
      'Priority Slack support'
    ],
    popular: false,
    fungiesProductId: 'pro_plan_monthly'
  },
  // Task Packages
  {
    id: 4,
    name: 'Single Task',
    description: 'Ideal for quick fixes and small updates',
    type: ProductType.TaskPackage,
    price: 49,
    originalPrice: 99,
    billingPeriod: 'Single task',
    features: [
      'One development request',
      '48-72h average delivery',
      '1 round of revisions',
      'Email support'
    ],
    popular: false,
    badge: 'First-time 50% off!',
    fungiesProductId: 'single_task'
  },
  {
    id: 5,
    name: 'Basic Pack',
    description: 'Best for multiple small features',
    type: ProductType.TaskPackage,
    price: 449,
    billingPeriod: 'Package of 5 tasks',
    features: [
      '5 development requests',
      '48h average delivery per request',
      '2 rounds of revisions per request',
      'Email support'
    ],
    popular: false,
    fungiesProductId: 'basic_pack'
  },
  {
    id: 6,
    name: 'Growth Pack',
    description: 'Perfect for significant improvements',
    type: ProductType.TaskPackage,
    price: 849,
    billingPeriod: 'Package of 10 tasks',
    features: [
      '10 development requests',
      '48h average delivery per request',
      '2 rounds of revisions per request',
      'Slack channel support'
    ],
    popular: false,
    fungiesProductId: 'growth_pack'
  },
  // App Packages
  {
    id: 7,
    name: 'MVP Launchpad',
    description: 'Perfect for validating your business idea quickly',
    type: ProductType.AppPackage,
    price: 7999,
    billingPeriod: 'Split into 3 milestone payments',
    features: [
      'Custom designed responsive web app',
      'Core feature implementation',
      'Basic user authentication',
      'Data storage and retrieval',
      '~4-6 weeks delivery'
    ],
    popular: false,
    fungiesProductId: 'mvp_launchpad'
  },
  {
    id: 8,
    name: 'Scale-up Accelerator',
    description: 'Ideal for businesses ready to expand their digital capabilities',
    type: ProductType.AppPackage,
    price: 16999,
    billingPeriod: 'Split into 4 milestone payments',
    features: [
      'Advanced web application',
      'Complex business logic implementation',
      'Third-party API integrations',
      'Performance optimization',
      'Basic analytics setup',
      '~8-14 weeks delivery'
    ],
    popular: true,
    fungiesProductId: 'scaleup_accelerator'
  },
  {
    id: 9,
    name: 'Enterprise Powerhouse',
    description: 'Comprehensive solution for large-scale business requirements',
    type: ProductType.AppPackage,
    price: 37999,
    billingPeriod: 'Split into 5 milestone payments',
    features: [
      'Fully custom enterprise-grade application',
      'Advanced user roles and permissions',
      'Scalable architecture',
      'Comprehensive testing suite',
      'DevOps setup and deployment',
      '~12-18 weeks delivery'
    ],
    popular: false,
    fungiesProductId: 'enterprise_powerhouse'
  }
]);

const filteredProducts = computed(() => {
  if (currentFilter.value === 'all') return products.value;
  return products.value.filter(product => product.type === currentFilter.value);
});

const getTypeConfig = (type: ProductType) => typeConfig[type];

const purchaseProduct = async (product: Product) => {
  console.log('Purchasing product:', product);
};

onMounted(() => {
  document.title = 'Store | AppsByLuke';
});
</script>
