<template>
  <TransitionRoot appear :show="isOpen" as="template">
    <Dialog as="div" class="relative z-50" @close="closeModal">
      <TransitionChild
        as="template"
        enter="duration-300 ease-out"
        enter-from="opacity-0"
        enter-to="opacity-100"
        leave="duration-200 ease-in"
        leave-from="opacity-100"
        leave-to="opacity-0"
      >
        <div class="fixed inset-0 bg-black/25" />
      </TransitionChild>

      <div class="fixed inset-0 overflow-y-auto">
        <div class="flex min-h-full items-center justify-center p-4">
          <TransitionChild
            as="template"
            enter="duration-300 ease-out"
            enter-from="opacity-0 scale-95"
            enter-to="opacity-100 scale-100"
            leave="duration-200 ease-in"
            leave-from="opacity-100 scale-100"
            leave-to="opacity-0 scale-95"
          >
            <DialogPanel class="w-full max-w-2xl transform overflow-hidden bg-white p-6 text-left align-middle shadow-xl transition-all neo-brutalism">
              <DialogTitle as="h3" class="text-2xl font-bold mb-4">
                New Task
              </DialogTitle>

              <form @submit.prevent="handleSubmit" class="space-y-6">
                <!-- Basic Information -->
                <div class="space-y-4">
                  <div>
                    <label class="block font-bold mb-2">Title</label>
                    <input
                      v-model="form.title"
                      type="text"
                      class="w-full p-2 border-4 border-black"
                      required
                    />
                  </div>

                  <div>
                    <label class="block font-bold mb-2">Description</label>
                    <textarea
                      v-model="form.description"
                      class="w-full p-2 border-4 border-black h-32"
                      required
                    ></textarea>
                  </div>

                  <div>
                    <label class="block font-bold mb-2">Project</label>
                    <select
                      v-model="form.projectId"
                      class="w-full p-2 border-4 border-black"
                    >
                      <option :value="null">No Project (Standalone Task)</option>
                      <option
                        v-for="project in projectsStore.projects"
                        :key="project.id"
                        :value="project.id"
                      >
                        {{ project.name }}
                      </option>
                    </select>
                  </div>
                </div>

                <!-- Repository Information -->
                <div class="space-y-4">
                  <h4 class="font-bold text-lg">Repository Information</h4>

                  <div>
                    <label class="block font-bold mb-2">Repository URL</label>
                    <input
                      v-model="form.repository.url"
                      type="url"
                      class="w-full p-2 border-4 border-black"
                      placeholder="https://github.com/username/repository"
                    />
                  </div>

                  <div class="flex items-center gap-2">
                    <input
                      v-model="form.repository.isPrivate"
                      type="checkbox"
                      id="isPrivate"
                      class="w-5 h-5 border-2 border-black"
                    />
                    <label for="isPrivate" class="font-bold">Private Repository</label>
                  </div>

                  <div v-if="form.repository.isPrivate"
                       class="bg-yellow-100 p-4 border-4 border-black">
                    <div class="flex items-center gap-2">
                      <Icon icon="tabler:alert-triangle" class="w-6 h-6"/>
                      <p class="font-bold">Repository Access Required</p>
                    </div>
                    <p class="mt-2">Please send repository invitation to:</p>
                    <div class="mt-2 flex items-center gap-2">
                      <div class="bg-white px-3 py-2 border-2 border-black font-mono flex-1">
                        luke@appsbyluke.com
                      </div>
                      <button
                        type="button"
                        class="p-2 bg-blue-100 neo-brutalism neo-brutalism-hover group relative"
                        @click="copyToClipboard('luke@appsbyluke.com')"
                      >
                        <Icon
                          :icon="justCopied ? 'tabler:check' : 'tabler:copy'"
                          class="w-5 h-5"
                        />
                        <div class="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 bg-black text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                          {{ justCopied ? 'Copied!' : 'Copy email' }}
                        </div>
                      </button>
                    </div>
                  </div>
                </div>

                <!-- Access Requirements -->
                <div class="space-y-4">
                  <h4 class="font-bold text-lg">Access Requirements</h4>
                  <div class="space-y-4">
                    <div class="flex gap-4">
                      <select
                        v-model="newAccess.type"
                        class="p-2 border-4 border-black"
                      >
                        <option value="url">URL/Domain</option>
                        <option value="ip">IP Address</option>
                        <option value="credentials">Credentials</option>
                      </select>

                      <input
                        v-model="newAccess.value"
                        type="text"
                        class="flex-1 p-2 border-4 border-black"
                        :placeholder="getAccessPlaceholder"
                      />

                      <button
                        type="button"
                        @click="addAccess"
                        class="px-4 py-2 bg-blue-500 text-white neo-brutalism neo-brutalism-hover font-bold whitespace-nowrap"
                      >
                        Add Access
                      </button>
                    </div>

                    <input
                      v-model="newAccess.description"
                      type="text"
                      class="w-full p-2 border-4 border-black"
                      placeholder="Brief description of what this access is for"
                    />
                  </div>

                  <div v-if="form.accessRequirements.length > 0" class="space-y-2">
                    <div
                      v-for="(req, index) in form.accessRequirements"
                      :key="index"
                      class="flex items-center justify-between p-4 bg-gray-100 border-2 border-black"
                    >
                      <div class="space-y-1">
                        <div class="flex items-center gap-2">
                          <span class="font-bold">{{ formatAccessType(req.type) }}:</span>
                          <span>{{ req.value }}</span>
                        </div>
                        <div class="text-sm text-gray-600">
                          {{ req.description }}
                        </div>
                      </div>
                      <button
                        type="button"
                        @click="removeAccess(index)"
                        class="p-2 hover:bg-red-100 group relative"
                      >
                        <Icon icon="tabler:trash" class="w-5 h-5" />
                        <div class="absolute bottom-full mb-2 right-0 bg-black text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                          Remove
                        </div>
                      </button>
                    </div>
                  </div>

                  <div v-if="form.accessRequirements.length > 0"
                       class="bg-yellow-100 p-4 border-4 border-black">
                    <div class="flex items-center gap-2">
                      <Icon icon="tabler:info-circle" class="w-6 h-6"/>
                      <p class="font-bold">Development will start after all access is granted.</p>
                    </div>
                  </div>
                </div>

                <!-- File Upload -->
                <div class="space-y-4">
                  <h4 class="font-bold text-lg">Attachments</h4>
                  <FileUploadZone
                    v-model:files="form.files"
                  />
                </div>

                <div class="flex justify-end gap-4 pt-4">
                  <button
                    type="button"
                    @click="closeModal"
                    class="px-4 py-2 bg-gray-200 neo-brutalism neo-brutalism-hover font-bold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    class="px-4 py-2 bg-blue-500 text-white neo-brutalism neo-brutalism-hover font-bold"
                  >
                    Create Task
                  </button>
                </div>
              </form>
            </DialogPanel>
          </TransitionChild>
        </div>
      </div>
    </Dialog>
  </TransitionRoot>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import {
  Dialog,
  DialogPanel,
  DialogTitle,
  TransitionChild,
  TransitionRoot,
} from '@headlessui/vue';
import { Icon } from '@iconify/vue';
import { useProjectsStore } from '@/stores/projects';
import FileUploadZone from './FileUploadZone.vue';
import type { TaskFile, TaskRepository, AccessRequirement } from '@/types/task';

const props = defineProps<{
  isOpen: boolean;
}>();

const emit = defineEmits<{
  'close': [],
  'submit': [{
    title: string;
    description: string;
    projectId: number | null;
    repository: TaskRepository;
    accessRequirements: AccessRequirement[];
    files: TaskFile[];
  }]
}>();

const projectsStore = useProjectsStore();

const form = ref({
  title: '',
  description: '',
  projectId: null as number | null,
  repository: {
    url: '',
    isPrivate: false,
    accessGranted: false
  },
  accessRequirements: [] as AccessRequirement[],
  files: [] as TaskFile[]
});

const newAccess = ref({
  type: 'url' as 'url' | 'ip' | 'credentials',
  value: '',
  description: ''
});

const justCopied = ref(false);

const getAccessPlaceholder = computed(() => {
  switch (newAccess.value.type) {
    case 'url':
      return 'e.g., https://api.example.com';
    case 'ip':
      return 'e.g., 192.168.1.1';
    case 'credentials':
      return 'e.g., AWS access keys, database credentials';
  }
});

const formatAccessType = (type: string) => {
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

const copyToClipboard = async (text: string) => {
  try {
    await navigator.clipboard.writeText(text);
    justCopied.value = true;
    setTimeout(() => {
      justCopied.value = false;
    }, 2000);
  } catch (err) {
    console.error('Failed to copy text:', err);
  }
};

const addAccess = () => {
  if (newAccess.value.value.trim() && newAccess.value.description.trim()) {
    form.value.accessRequirements.push({ ...newAccess.value });
    newAccess.value = {
      type: 'url',
      value: '',
      description: ''
    };
  }
};

const removeAccess = (index: number) => {
  form.value.accessRequirements.splice(index, 1);
};

const closeModal = () => {
  emit('close');
  resetForm();
};

const handleSubmit = () => {
  emit('submit', {
    title: form.value.title,
    description: form.value.description,
    projectId: form.value.projectId,
    repository: form.value.repository,
    accessRequirements: form.value.accessRequirements,
    files: form.value.files
  });
  resetForm();
  closeModal();
};

const resetForm = () => {
  form.value = {
    title: '',
    description: '',
    projectId: null,
    repository: {
      url: '',
      isPrivate: false,
      accessGranted: false
    },
    accessRequirements: [],
    files: []
  };
  newAccess.value = {
    type: 'url',
    value: '',
    description: ''
  };
};
</script>
