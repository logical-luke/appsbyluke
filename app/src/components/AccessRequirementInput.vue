<template>
  <div class="space-y-4">
    <div class="flex gap-4">
      <select
        v-model="newRequirement.type"
        class="p-2 border-4 border-black"
        required
      >
        <option value="url">URL/Domain</option>
        <option value="ip">IP Address</option>
        <option value="credentials">Credentials</option>
      </select>

      <input
        v-model="newRequirement.value"
        type="text"
        class="flex-1 p-2 border-4 border-black"
        :placeholder="getPlaceholder"
        required
      />

      <button
        type="button"
        @click="addRequirement"
        class="px-4 py-2 bg-blue-500 text-white neo-brutalism neo-brutalism-hover font-bold"
      >
        Add
      </button>
    </div>

    <input
      v-model="newRequirement.description"
      type="text"
      class="w-full p-2 border-4 border-black"
      placeholder="Brief description of what this access is for"
      required
    />

    <div v-if="modelValue.length > 0" class="space-y-2">
      <div
        v-for="(req, index) in modelValue"
        :key="index"
        class="flex items-center justify-between p-4 bg-gray-100 border-2 border-black"
      >
        <div class="space-y-1">
          <div class="flex items-center gap-2">
            <span class="font-bold">{{ formatType(req.type) }}:</span>
            <span>{{ req.value }}</span>
          </div>
          <div class="text-sm text-gray-600">
            {{ req.description }}
          </div>
        </div>
        <button
          type="button"
          @click="removeRequirement(index)"
          class="p-1 hover:bg-red-100"
        >
          <Icon icon="tabler:x" class="w-5 h-5" />
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { Icon } from '@iconify/vue';
import type { AccessRequirement } from '@/types/task';

const props = defineProps<{
  modelValue: AccessRequirement[];
}>();

const emit = defineEmits<{
  'update:modelValue': [AccessRequirement[]];
}>();

const newRequirement = ref<AccessRequirement>({
  type: 'url',
  value: '',
  description: ''
});

const getPlaceholder = computed(() => {
  switch (newRequirement.value.type) {
    case 'url':
      return 'e.g., https://api.example.com';
    case 'ip':
      return 'e.g., 192.168.1.1';
    case 'credentials':
      return 'e.g., AWS access keys, database credentials';
  }
});

const formatType = (type: string) => {
  switch (type) {
    case 'url':
      return 'URL/Domain';
    case 'ip':
      return 'IP Address';
    case 'credentials':
      return 'Credentials';
    default:
      return type;
  }
};

const addRequirement = () => {
  if (newRequirement.value.value.trim() && newRequirement.value.description.trim()) {
    emit('update:modelValue', [...props.modelValue, { ...newRequirement.value }]);
    newRequirement.value = {
      type: 'url',
      value: '',
      description: ''
    };
  }
};

const removeRequirement = (index: number) => {
  const updated = [...props.modelValue];
  updated.splice(index, 1);
  emit('update:modelValue', updated);
};
</script>
