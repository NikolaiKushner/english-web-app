# 🎨 UI Component Library

A comprehensive, reusable UI component library for the English Learning Platform built with Vue 3, TypeScript, and Tailwind CSS.

## 📁 Structure

```
app/components/ui/
├── base/           # Basic building blocks
│   ├── UiButton.vue
│   ├── UiCard.vue
│   ├── UiSpinner.vue
│   └── UiBadge.vue
├── form/           # Form controls
│   ├── UiInput.vue
│   ├── UiSelect.vue
│   └── UiTextarea.vue
├── feedback/       # User feedback components
│   ├── UiAlert.vue
│   ├── UiToast.vue
│   ├── UiLoadingSpinner.vue
│   └── UiProgress.vue
├── layout/         # Layout components
│   ├── UiModal.vue
│   └── UiErrorBoundary.vue
├── navigation/     # Navigation components
│   ├── UiHeader.vue
│   └── UiFooter.vue
└── index.ts        # Barrel exports
```

## 🧱 Base Components

### UiButton
Versatile button component with multiple variants and states.

```vue
<UiButton variant="primary" size="lg" :loading="isLoading">
  Save Changes
</UiButton>

<UiButton variant="secondary" to="/dashboard">
  Go to Dashboard
</UiButton>

<UiButton variant="danger" @click="deleteItem">
  <template #icon-left>
    <TrashIcon class="w-4 h-4" />
  </template>
  Delete
</UiButton>
```

**Props:**
- `variant`: 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'ghost' | 'link'
- `size`: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
- `loading`: boolean
- `disabled`: boolean
- `to`: string (for NuxtLink)
- `href`: string (for anchor)
- `block`: boolean
- `rounded`: boolean

### UiCard
Flexible card container with header, body, and footer slots.

```vue
<UiCard title="User Profile" variant="elevated" hover>
  <p>Card content goes here</p>
  
  <template #footer>
    <UiButton variant="primary">Save</UiButton>
  </template>
</UiCard>
```

**Props:**
- `title`: string
- `variant`: 'default' | 'outlined' | 'elevated' | 'flat'
- `padding`: 'none' | 'sm' | 'md' | 'lg'
- `rounded`: boolean
- `hover`: boolean

### UiBadge
Small status indicators and labels.

```vue
<UiBadge variant="success" rounded>Active</UiBadge>
<UiBadge variant="warning" outline>Pending</UiBadge>
```

**Props:**
- `variant`: 'default' | 'primary' | 'success' | 'warning' | 'danger' | 'info'
- `size`: 'xs' | 'sm' | 'md' | 'lg'
- `rounded`: boolean
- `outline`: boolean

## 📝 Form Components

### UiInput
Enhanced input field with validation and icons.

```vue
<UiInput
  v-model="email"
  label="Email Address"
  type="email"
  placeholder="Enter your email"
  :error="emailError"
  hint="We'll never share your email"
  required
>
  <template #icon-left>
    <EnvelopeIcon class="w-4 h-4 text-gray-400" />
  </template>
</UiInput>
```

**Props:**
- `modelValue`: string | number
- `label`: string
- `type`: 'text' | 'email' | 'password' | 'number' | etc.
- `placeholder`: string
- `hint`: string
- `error`: string
- `disabled`: boolean
- `required`: boolean
- `size`: 'sm' | 'md' | 'lg'

### UiSelect
Styled select dropdown with options.

```vue
<UiSelect
  v-model="selectedLevel"
  label="Difficulty Level"
  placeholder="Choose a level"
  :options="[
    { label: 'Beginner', value: 'beginner' },
    { label: 'Intermediate', value: 'intermediate' },
    { label: 'Advanced', value: 'advanced' }
  ]"
  :error="levelError"
/>
```

### UiTextarea
Multi-line text input with character counting.

```vue
<UiTextarea
  v-model="description"
  label="Description"
  placeholder="Enter description..."
  :rows="4"
  :max-length="500"
  resize="vertical"
/>
```

## 💬 Feedback Components

### UiAlert
Contextual alert messages with dismiss functionality.

```vue
<UiAlert
  variant="success"
  title="Success!"
  message="Your changes have been saved."
  dismissible
  @dismiss="handleDismiss"
/>
```

**Props:**
- `variant`: 'info' | 'success' | 'warning' | 'error'
- `title`: string
- `message`: string
- `dismissible`: boolean
- `modelValue`: boolean

### UiProgress
Progress indicator with customizable appearance.

```vue
<UiProgress
  :value="75"
  :max="100"
  label="Course Progress"
  variant="success"
  size="lg"
  animated
  striped
/>
```

**Props:**
- `value`: number
- `max`: number
- `min`: number
- `label`: string
- `variant`: 'default' | 'success' | 'warning' | 'danger' | 'info'
- `animated`: boolean
- `striped`: boolean

### UiLoadingSpinner
Flexible loading spinner with message support.

```vue
<UiLoadingSpinner
  size="lg"
  message="Loading your data..."
  full-screen
/>
```

## 🏗️ Layout Components

### UiModal
Accessible modal dialog with slots for header, body, and footer.

```vue
<UiModal
  v-model="showModal"
  title="Confirm Action"
  size="md"
  :closable="true"
  :close-on-backdrop="true"
>
  <p>Are you sure you want to delete this item?</p>
  
  <template #footer>
    <UiButton variant="secondary" @click="showModal = false">
      Cancel
    </UiButton>
    <UiButton variant="danger" @click="confirmDelete">
      Delete
    </UiButton>
  </template>
</UiModal>
```

**Props:**
- `modelValue`: boolean
- `title`: string
- `size`: 'sm' | 'md' | 'lg' | 'xl' | 'full'
- `closable`: boolean
- `closeOnBackdrop`: boolean

## 🎨 Design System

### Colors
- **Primary**: Blue-600 (#2563eb)
- **Secondary**: Gray-200 (#e5e7eb)
- **Success**: Green-600 (#16a34a)
- **Warning**: Yellow-500 (#eab308)
- **Danger**: Red-600 (#dc2626)
- **Info**: Blue-500 (#3b82f6)

### Sizes
- **xs**: Extra small (12px/16px)
- **sm**: Small (14px/20px)
- **md**: Medium (16px/24px)
- **lg**: Large (18px/28px)
- **xl**: Extra large (20px/32px)

### Spacing
- **sm**: 0.5rem (8px)
- **md**: 1rem (16px)
- **lg**: 1.5rem (24px)
- **xl**: 2rem (32px)

## 🚀 Usage Examples

### Form with Validation
```vue
<template>
  <form @submit.prevent="handleSubmit">
    <UiInput
      v-model="form.name"
      label="Full Name"
      :error="errors.name"
      required
    />
    
    <UiSelect
      v-model="form.level"
      label="Level"
      :options="levelOptions"
      :error="errors.level"
      required
    />
    
    <UiTextarea
      v-model="form.bio"
      label="Bio"
      :max-length="200"
      hint="Tell us about yourself"
    />
    
    <UiButton
      type="submit"
      :loading="isSubmitting"
      loading-text="Saving..."
      block
    >
      Save Profile
    </UiButton>
  </form>
</template>
```

### Data Display with Cards
```vue
<template>
  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    <UiCard
      v-for="lesson in lessons"
      :key="lesson.id"
      :title="lesson.title"
      hover
      class="cursor-pointer"
      @click="openLesson(lesson)"
    >
      <p>{{ lesson.description }}</p>
      
      <div class="flex items-center justify-between mt-4">
        <UiBadge :variant="getBadgeVariant(lesson.level)">
          {{ lesson.level }}
        </UiBadge>
        
        <UiProgress
          :value="lesson.progress"
          :max="100"
          size="sm"
          variant="success"
        />
      </div>
    </UiCard>
  </div>
</template>
```

## 🔧 Customization

### Extending Components
Components can be extended using Vue's composition API:

```vue
<script setup lang="ts">
// Custom button with additional functionality
const emit = defineEmits(['custom-action'])

const handleClick = () => {
  // Custom logic
  emit('custom-action')
}
</script>

<template>
  <UiButton @click="handleClick" v-bind="$attrs">
    <slot />
  </UiButton>
</template>
```

### Theming
Components use CSS custom properties for easy theming:

```css
:root {
  --ui-primary: #2563eb;
  --ui-secondary: #e5e7eb;
  --ui-border-radius: 0.5rem;
  --ui-font-family: 'Inter', system-ui, sans-serif;
}
```

## 📚 Best Practices

1. **Consistent Sizing**: Use the size prop consistently across components
2. **Proper Labeling**: Always provide labels for form components
3. **Error Handling**: Use error props for validation feedback
4. **Loading States**: Show loading states for async operations
5. **Accessibility**: Components include ARIA attributes and keyboard support
6. **Responsive**: All components are mobile-friendly by default

## 🛠️ Development

### Adding New Components
1. Create component in appropriate subfolder
2. Follow naming convention: `Ui[ComponentName].vue`
3. Add TypeScript interfaces for props
4. Include slots for flexibility
5. Add to `index.ts` exports
6. Update documentation

### Testing Components
```bash
# Test component in isolation
npm run test:unit UiButton

# Visual testing
npm run storybook
```

---

**Need help?** Check the component source code or create an issue for support! 🚀
