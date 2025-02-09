<template>
  <div
    class="relative"
    @dragenter.prevent="dragover = true"
    @dragleave.prevent="dragover = false"
    @dragover.prevent="dragover = true"
    @drop.prevent="handleDrop"
  >
    <div
      class="border-4 border-dashed border-black p-8 text-center transition-colors"
      :class="[dragover ? 'bg-blue-50' : 'bg-gray-50']"
    >
      <div class="flex flex-col items-center gap-4">
        <Icon icon="tabler:upload" class="w-12 h-12" />
        <div>
          <p class="font-bold">Drop files here or click to upload</p>
          <p class="text-sm text-gray-600">Maximum file size: 10MB</p>
        </div>
        <input
          type="file"
          multiple
          class="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          @change="handleFileSelect"
        />
      </div>
    </div>

    <!-- File List -->
    <div v-if="files.length > 0" class="mt-4 space-y-2">
      <div
        v-for="file in files"
        :key="file.id"
        class="flex items-center justify-between p-2 bg-white border-2 border-black"
      >
        <div class="flex items-center gap-2">
          <Icon icon="tabler:file" class="w-5 h-5" />
          <span class="font-medium">{{ file.name }}</span>
          <span class="text-sm text-gray-600">({{ formatFileSize(file.size) }})</span>
        </div>
        <button
          @click="removeFile(file.id)"
          class="p-1 hover:bg-red-100 rounded-full"
          title="Remove file"
        >
          <Icon icon="tabler:x" class="w-5 h-5" />
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { Icon } from '@iconify/vue';
import type { TaskFile } from '@/types/task';

const emit = defineEmits<{
  'update:files': [TaskFile[]];
}>();

const props = defineProps<{
  files: TaskFile[];
}>();

const dragover = ref(false);

const handleDrop = (e: DragEvent) => {
  dragover.value = false;
  const droppedFiles = Array.from(e.dataTransfer?.files || []);
  processFiles(droppedFiles);
};

const handleFileSelect = (e: Event) => {
  const input = e.target as HTMLInputElement;
  const selectedFiles = Array.from(input.files || []);
  processFiles(selectedFiles);
};

const processFiles = (newFiles: File[]) => {
  const validFiles = newFiles.filter(file => file.size <= 10 * 1024 * 1024); // 10MB limit

  const newTaskFiles: TaskFile[] = validFiles.map(file => ({
    id: crypto.randomUUID(),
    name: file.name,
    size: file.size,
    type: file.type
  }));

  emit('update:files', [...props.files, ...newTaskFiles]);
};

const removeFile = (fileId: string) => {
  emit('update:files', props.files.filter(f => f.id !== fileId));
};

const formatFileSize = (bytes: number) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};
</script>
