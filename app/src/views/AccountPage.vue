<template>
  <div class="space-y-6">
    <div class="flex justify-between items-center">
      <h1 class="text-4xl font-bold transform -rotate-2">
        <span class="bg-yellow-300 px-4 py-2 inline-block neo-brutalism">Account</span>
      </h1>
    </div>

    <div class="bg-white p-6 neo-brutalism">
      <div class="flex flex-wrap gap-4 mb-6">
        <button
          v-for="tab in tabs"
          :key="tab.id"
          @click="currentTab = tab.id"
          class="px-4 py-2 neo-brutalism neo-brutalism-hover font-bold"
          :class="[
            currentTab === tab.id
              ? 'bg-blue-200'
              : 'bg-gray-100 hover:bg-blue-100'
          ]"
        >
          <div class="flex items-center">
            <Icon :icon="tab.icon" class="mr-2 w-5 h-5" />
            {{ tab.label }}
          </div>
        </button>
      </div>

      <!-- Profile Tab -->
      <div v-if="currentTab === 'profile'" class="space-y-8">
        <!-- Basic Info Section -->
        <div class="space-y-6">
          <h2 class="text-xl font-bold">Basic Information</h2>
          <div class="grid md:grid-cols-2 gap-6">
            <div>
              <label class="block text-lg font-bold text-black">Full Name</label>
              <input
                v-model="profile.fullName"
                type="text"
                class="mt-1 block w-full border-4 border-black neo-brutalism py-2 px-3 focus:outline-none focus:bg-pink-200 bg-white transition-colors duration-300"
              >
            </div>
            <div>
              <label class="block text-lg font-bold text-black">Email</label>
              <input
                v-model="profile.email"
                type="email"
                class="mt-1 block w-full border-4 border-black neo-brutalism py-2 px-3 focus:outline-none focus:bg-pink-200 bg-white transition-colors duration-300"
              >
            </div>
            <div>
              <label class="block text-lg font-bold text-black">Phone</label>
              <input
                v-model="profile.phone"
                type="tel"
                class="mt-1 block w-full border-4 border-black neo-brutalism py-2 px-3 focus:outline-none focus:bg-pink-200 bg-white transition-colors duration-300"
              >
            </div>
          </div>
        </div>

        <!-- Business Info Section -->
        <div class="space-y-6">
          <h2 class="text-xl font-bold">Business Information</h2>
          <div class="grid md:grid-cols-2 gap-6">
            <div>
              <label class="block text-lg font-bold text-black">Company Name</label>
              <input
                v-model="profile.companyName"
                type="text"
                class="mt-1 block w-full border-4 border-black neo-brutalism py-2 px-3 focus:outline-none focus:bg-pink-200 bg-white transition-colors duration-300"
              >
            </div>
            <div>
              <label class="block text-lg font-bold text-black">VAT Number</label>
              <input
                v-model="profile.vatNumber"
                type="text"
                class="mt-1 block w-full border-4 border-black neo-brutalism py-2 px-3 focus:outline-none focus:bg-pink-200 bg-white transition-colors duration-300"
              >
            </div>
            <div class="md:col-span-2">
              <label class="block text-lg font-bold text-black">Business Address</label>
              <textarea
                v-model="profile.businessAddress"
                rows="3"
                class="mt-1 block w-full border-4 border-black neo-brutalism py-2 px-3 focus:outline-none focus:bg-pink-200 bg-white transition-colors duration-300"
              ></textarea>
            </div>
          </div>
        </div>

        <!-- Password Change Section -->
        <div class="space-y-6">
          <h2 class="text-xl font-bold">Change Password</h2>
          <div class="space-y-4">
            <div>
              <label class="block text-lg font-bold text-black">Current Password</label>
              <input
                v-model="passwordChange.current"
                type="password"
                class="mt-1 block w-full border-4 border-black neo-brutalism py-2 px-3 focus:outline-none focus:bg-pink-200 bg-white transition-colors duration-300"
              >
            </div>
            <div>
              <label class="block text-lg font-bold text-black">New Password</label>
              <input
                v-model="passwordChange.new"
                type="password"
                class="mt-1 block w-full border-4 border-black neo-brutalism py-2 px-3 focus:outline-none focus:bg-pink-200 bg-white transition-colors duration-300"
              >
              <div v-if="passwordChange.new" class="mt-2 text-sm" :class="passwordStrength(passwordChange.new).color">
                Password strength: {{ passwordStrength(passwordChange.new).text }}
              </div>
            </div>
            <div>
              <label class="block text-lg font-bold text-black">Confirm New Password</label>
              <input
                v-model="passwordChange.confirm"
                type="password"
                class="mt-1 block w-full border-4 border-black neo-brutalism py-2 px-3 focus:outline-none focus:bg-pink-200 bg-white transition-colors duration-300"
              >
            </div>
            <button
              @click="changePassword"
              class="px-6 py-2 bg-blue-500 text-white neo-brutalism neo-brutalism-hover font-bold"
            >
              Update Password
            </button>
          </div>
        </div>

        <!-- Danger Zone -->
        <div class="space-y-6 bg-red-50 p-6 neo-brutalism">
          <h2 class="text-xl font-bold text-red-600">Danger Zone</h2>
          <div class="space-y-4">
            <div class="flex items-center gap-2">
              <input
                v-model="deleteAccount.confirmed"
                type="checkbox"
                class="w-4 h-4"
              >
              <label class="text-red-600">
                I understand that this action cannot be undone and all my data will be permanently deleted
              </label>
            </div>
            <button
              @click="handleDeleteAccount"
              :disabled="!deleteAccount.confirmed"
              class="px-6 py-2 bg-red-500 text-white neo-brutalism neo-brutalism-hover font-bold disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Delete Account
            </button>
          </div>
        </div>
      </div>

      <!-- Billing Tab -->
      <div v-if="currentTab === 'billing'" class="space-y-8">
        <!-- Active Subscription -->
        <div v-if="billing.subscription" class="bg-blue-50 p-6 neo-brutalism">
          <h2 class="text-xl font-bold mb-4">Active Subscription</h2>
          <div class="space-y-4">
            <div class="flex justify-between items-center">
              <span class="font-bold">Plan</span>
              <span>{{ billing.subscription.plan }}</span>
            </div>
            <div class="flex justify-between items-center">
              <span class="font-bold">Status</span>
              <div :class="[
                getStatusConfig(billing.subscription.status).bgColor,
                'px-3 py-1 neo-brutalism text-sm font-bold'
              ]">
                {{ getStatusConfig(billing.subscription.status).label }}
              </div>
            </div>
            <div class="flex justify-between items-center">
              <span class="font-bold">Next billing</span>
              <span>{{ formatDate(billing.subscription.nextBilling) }}</span>
            </div>
            <div class="flex justify-between items-center">
              <span class="font-bold">Amount</span>
              <span>${{ billing.subscription.amount }}/month</span>
            </div>
          </div>
        </div>

        <!-- Task Packages -->
        <div class="bg-purple-50 p-6 neo-brutalism">
          <h2 class="text-xl font-bold mb-4">Task Packages</h2>
          <div class="space-y-4">
            <div v-for="pkg in billing.taskPackages"
                 :key="pkg.id"
                 class="bg-white p-4 neo-brutalism">
              <div class="flex justify-between items-start">
                <div>
                  <h3 class="font-bold">{{ pkg.name }}</h3>
                  <p class="text-sm text-gray-600">Purchased on {{ formatDate(pkg.purchaseDate) }}</p>
                </div>
                <div class="text-right">
                  <div class="font-bold">{{ pkg.remainingTasks }} tasks remaining</div>
                  <div class="text-sm text-gray-600">of {{ pkg.totalTasks }} total</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- App Packages -->
        <div class="bg-orange-50 p-6 neo-brutalism">
          <h2 class="text-xl font-bold mb-4">App Packages</h2>
          <div class="space-y-4">
            <div v-for="pkg in billing.appPackages"
                 :key="pkg.id"
                 class="bg-white p-4 neo-brutalism">
              <div class="flex justify-between items-start mb-4">
                <div>
                  <h3 class="font-bold">{{ pkg.name }}</h3>
                  <p class="text-sm text-gray-600">Purchased on {{ formatDate(pkg.purchaseDate) }}</p>
                </div>
                <div :class="[
                  getAppPackageStatusConfig(pkg.status).bgColor,
                  'px-3 py-1 neo-brutalism text-sm font-bold'
                ]">
                  {{ getAppPackageStatusConfig(pkg.status).label }}
                </div>
              </div>

              <div class="space-y-3">
                <div v-for="(milestone, index) in pkg.milestones"
                     :key="index"
                     class="flex items-center gap-4">
                  <div class="w-8 h-8 flex-shrink-0 rounded-full border-4 border-black flex items-center justify-center"
                       :class="getMilestoneStatusConfig(milestone.status).bgColor">
                    <Icon :icon="getMilestoneStatusConfig(milestone.status).icon" class="w-4 h-4" />
                  </div>
                  <div class="flex-grow">
                    <div class="flex justify-between items-center">
                      <span class="font-bold">{{ milestone.phase }}</span>
                      <span class="text-sm">{{ milestone.payment }}</span>
                    </div>
                    <div class="text-sm text-gray-600">
                      Due: {{ formatDate(milestone.dueDate) }}
                    </div>
                  </div>
                </div>
              </div>

              <div class="mt-4 pt-4 border-t-2 border-black">
                <div class="flex justify-between items-center">
                  <span class="font-bold">Total Amount</span>
                  <span>${{ pkg.totalAmount }}</span>
                </div>
                <div class="flex justify-between items-center text-sm text-gray-600">
                  <span>Paid</span>
                  <span>${{ pkg.paidAmount }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Invoices Tab -->
      <div v-if="currentTab === 'invoices'" class="space-y-6">
        <div class="overflow-x-auto">
          <table class="w-full">
            <thead>
              <tr class="border-b-4 border-black">
                <th class="text-left py-4 px-4">Invoice #</th>
                <th class="text-left py-4 px-4">Date</th>
                <th class="text-left py-4 px-4">Amount</th>
                <th class="text-left py-4 px-4">Status</th>
                <th class="text-left py-4 px-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="invoice in invoices"
                :key="invoice.id"
                class="border-b-2 border-black hover:bg-blue-50"
              >
                <td class="py-4 px-4">{{ invoice.number }}</td>
                <td class="py-4 px-4">{{ formatDate(invoice.date) }}</td>
                <td class="py-4 px-4">${{ invoice.amount }}</td>
                <td class="py-4 px-4">
                  <div :class="[
                    getInvoiceStatusConfig(invoice.status).bgColor,
                    'inline-flex items-center gap-2 px-3 py-1 neo-brutalism'
                  ]">
                    {{ getInvoiceStatusConfig(invoice.status).label }}
                  </div>
                </td>
                <td class="py-4 px-4">
                  <button
                    @click="downloadInvoice(invoice)"
                    class="p-2 bg-blue-100 neo-brutalism neo-brutalism-hover"
                    title="Download Invoice"
                  >
                    <Icon icon="tabler:download" class="w-5 h-5" />
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { Icon } from '@iconify/vue';
import * as yup from 'yup';

const tabs = [
  { id: 'profile', label: 'Profile', icon: 'tabler:user' },
  { id: 'billing', label: 'Billing', icon: 'tabler:receipt' },
  { id: 'invoices', label: 'Invoices', icon: 'tabler:file-invoice' }
];

const currentTab = ref('profile');

// Profile and Password Management
interface Profile {
  fullName: string;
  email: string;
  phone: string;
  companyName: string;
  vatNumber: string;
  businessAddress: string;
}

interface PasswordChange {
  current: string;
  new: string;
  confirm: string;
}

const profile = ref<Profile>({
  fullName: '',
  email: '',
  phone: '',
  companyName: '',
  vatNumber: '',
  businessAddress: ''
});

const passwordChange = ref<PasswordChange>({
  current: '',
  new: '',
  confirm: ''
});

const deleteAccount = ref({
  confirmed: false
});

const passwordSchema = yup.string()
  .required('Password is required')
  .min(8, 'Password must be at least 8 characters')
  .matches(/[A-Z]/, 'Password must contain an uppercase letter')
  .matches(/[a-z]/, 'Password must contain a lowercase letter')
  .matches(/[0-9]/, 'Password must contain a number')
  .matches(/[^A-Za-z0-9]/, 'Password must contain a special character');

const passwordStrength = (password: string) => {
  if (!password) return { text: '', color: '' };
  if (password.length < 8) return { text: 'Too short', color: 'text-red-500' };
  if (passwordSchema.isValidSync(password)) return { text: 'Strong', color: 'text-green-500' };
  return { text: 'Weak', color: 'text-yellow-500' };
};

// Billing Types and Interfaces
enum SubscriptionStatus {
  Active = 'active',
  Paused = 'paused',
  Canceled = 'canceled'
}

enum AppPackageStatus {
  Planning = 'planning',
  InProgress = 'in_progress',
  OnHold = 'on_hold',
  Completed = 'completed'
}

enum MilestoneStatus {
  Pending = 'pending',
  InProgress = 'in_progress',
  Completed = 'completed'
}

interface Milestone {
  phase: string;
  status: MilestoneStatus;
  payment: string;
  dueDate: string;
}

interface TaskPackage {
  id: number;
  name: string;
  purchaseDate: string;
  totalTasks: number;
  remainingTasks: number;
}

interface AppPackage {
  id: number;
  name: string;
  purchaseDate: string;
  status: AppPackageStatus;
  milestones: Milestone[];
  totalAmount: number;
  paidAmount: number;
}

interface Subscription {
  plan: string;
  status: SubscriptionStatus;
  nextBilling: string;
  amount: number;
}

interface Billing {
  subscription: Subscription | null;
  taskPackages: TaskPackage[];
  appPackages: AppPackage[];
}
// Status Configurations
const statusConfig = {
  [SubscriptionStatus.Active]: {
    label: 'Active',
    bgColor: 'bg-green-100'
  },
  [SubscriptionStatus.Paused]: {
    label: 'Paused',
    bgColor: 'bg-yellow-100'
  },
  [SubscriptionStatus.Canceled]: {
    label: 'Canceled',
    bgColor: 'bg-red-100'
  }
};

const appPackageStatusConfig = {
  [AppPackageStatus.Planning]: {
    label: 'Planning',
    bgColor: 'bg-purple-100'
  },
  [AppPackageStatus.InProgress]: {
    label: 'In Progress',
    bgColor: 'bg-blue-100'
  },
  [AppPackageStatus.OnHold]: {
    label: 'On Hold',
    bgColor: 'bg-yellow-100'
  },
  [AppPackageStatus.Completed]: {
    label: 'Completed',
    bgColor: 'bg-green-100'
  }
};

const milestoneStatusConfig = {
  [MilestoneStatus.Pending]: {
    label: 'Pending',
    icon: 'tabler:clock',
    bgColor: 'bg-gray-100'
  },
  [MilestoneStatus.InProgress]: {
    label: 'In Progress',
    icon: 'tabler:player-play',
    bgColor: 'bg-blue-100'
  },
  [MilestoneStatus.Completed]: {
    label: 'Completed',
    icon: 'tabler:check',
    bgColor: 'bg-green-100'
  }
};

// Mock Billing Data
const billing = ref<Billing>({
  subscription: {
    plan: 'Standard Plan',
    status: SubscriptionStatus.Active,
    nextBilling: '2024-03-09T00:00:00Z',
    amount: 999
  },
  taskPackages: [
    {
      id: 1,
      name: 'Basic Pack',
      purchaseDate: '2024-01-15T00:00:00Z',
      totalTasks: 5,
      remainingTasks: 3
    },
    {
      id: 2,
      name: 'Single Task',
      purchaseDate: '2024-02-01T00:00:00Z',
      totalTasks: 1,
      remainingTasks: 1
    }
  ],
  appPackages: [
    {
      id: 1,
      name: 'MVP Launchpad',
      purchaseDate: '2024-01-15T00:00:00Z',
      status: AppPackageStatus.InProgress,
      milestones: [
        {
          phase: 'Design & Planning',
          status: MilestoneStatus.Completed,
          payment: '30%',
          dueDate: '2024-01-30T00:00:00Z'
        },
        {
          phase: 'Core Development',
          status: MilestoneStatus.InProgress,
          payment: '40%',
          dueDate: '2024-02-20T00:00:00Z'
        },
        {
          phase: 'Testing & Launch',
          status: MilestoneStatus.Pending,
          payment: '30%',
          dueDate: '2024-03-10T00:00:00Z'
        }
      ],
      totalAmount: 7999,
      paidAmount: 5599
    }
  ]
});

// Invoice Types and Data
enum InvoiceStatus {
  Paid = 'paid',
  Pending = 'pending',
  Failed = 'failed'
}

interface Invoice {
  id: number;
  number: string;
  date: string;
  amount: number;
  status: InvoiceStatus;
}

const invoiceStatusConfig = {
  [InvoiceStatus.Paid]: {
    label: 'Paid',
    bgColor: 'bg-green-100'
  },
  [InvoiceStatus.Pending]: {
    label: 'Pending',
    bgColor: 'bg-yellow-100'
  },
  [InvoiceStatus.Failed]: {
    label: 'Failed',
    bgColor: 'bg-red-100'
  }
};

const invoices = ref<Invoice[]>([
  {
    id: 1,
    number: 'INV-2024-001',
    date: '2024-02-09T00:00:00Z',
    amount: 999,
    status: InvoiceStatus.Paid
  },
  {
    id: 2,
    number: 'INV-2024-002',
    date: '2024-01-09T00:00:00Z',
    amount: 7999,
    status: InvoiceStatus.Paid
  },
  {
    id: 3,
    number: 'INV-2024-003',
    date: '2024-03-09T00:00:00Z',
    amount: 999,
    status: InvoiceStatus.Pending
  }
]);

// Helper Functions
const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
};

const getStatusConfig = (status: SubscriptionStatus) => statusConfig[status];
const getAppPackageStatusConfig = (status: AppPackageStatus) => appPackageStatusConfig[status];
const getMilestoneStatusConfig = (status: MilestoneStatus) => milestoneStatusConfig[status];
const getInvoiceStatusConfig = (status: InvoiceStatus) => invoiceStatusConfig[status];

// Action Handlers
const changePassword = async () => {
  if (!passwordSchema.isValidSync(passwordChange.value.new)) {
    console.error('Password does not meet requirements');
    return;
  }

  if (passwordChange.value.new !== passwordChange.value.confirm) {
    console.error('Passwords do not match');
    return;
  }

  try {
    // Implement password change logic
    console.log('Changing password');
    passwordChange.value = { current: '', new: '', confirm: '' };
  } catch (error) {
    console.error('Failed to change password:', error);
  }
};

const handleDeleteAccount = async () => {
  if (!deleteAccount.value.confirmed) return;

  try {
    // Implement account deletion logic
    console.log('Deleting account');
  } catch (error) {
    console.error('Failed to delete account:', error);
  }
};

const downloadInvoice = (invoice: Invoice) => {
  console.log('Downloading invoice:', invoice);
};

onMounted(async () => {
  document.title = 'Account | AppsByLuke';
  // Fetch user profile data
  // Fetch billing data
  // Fetch invoices
});
</script>
