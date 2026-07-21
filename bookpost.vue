<template>
  <div class="page-wrapper">
    <div class="form-container">
      <div class="form-header">
        <div class="header-icon">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
            <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/>
            <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
            <line x1="12" y1="7" x2="16" y2="7"/>
            <line x1="12" y1="11" x2="16" y2="11"/>
          </svg>
        </div>
        <div>
          <h1>Post a Book</h1>
          <p class="header-subtitle">Share your story with readers</p>
        </div>
      </div>

      <form @submit.prevent="handleSubmit" novalidate>
        <div class="fields-grid">

          <!-- Book Title -->
          <div class="field-group full-width">
            <label class="field-label" for="book-title">
              Book Title
              <span class="required">*</span>
            </label>
            <input
              id="book-title"
              v-model="form.title"
              type="text"
              class="text-input"
              :class="{ 'input-error': errors.title }"
              placeholder="Enter your book title..."
              @input="errors.title = ''"
            />
            <span v-if="errors.title" class="error-msg">{{ errors.title }}</span>
          </div>

          <!-- Category Select -->
          <div class="field-group">
            <label class="field-label">
              Category
              <span class="required">*</span>
            </label>
            <SearchableSelect
              v-model="form.category"
              :options="categories"
              field="name"
              placeholder="Select a category..."
              :error="errors.category"
              @change="errors.category = ''"
            />
            <span v-if="errors.category" class="error-msg">{{ errors.category }}</span>
          </div>

          <!-- Author Select -->
          <div class="field-group" v-if="props.sa">
            <label class="field-label">
              Author
              <span class="required">*</span>
            </label>
            <SearchableAuthorSelect
              v-model="form.author"
              :lang="userLang"
              placeholder="Select an author..."
              :error="errors.author"
              @change="errors.author = ''"
            />
            <span v-if="errors.author" class="error-msg">{{ errors.author }}</span>
          </div>
          <div v-if="!props.sa" class="mt-6 bg-emerald-50 border border-emerald-200 rounded-xl p-4 flex items-center justify-center">
            <div class="px-4">
              <p class="text-sm font-medium text-emerald-700">
                {{ labels.author }}: {{ authorName() }}
              </p>
              <p class="text-xs text-emerald-600">{{ labels.bookWillBePublishedByYourName }}</p>
            </div>
          </div>

          <!-- Series Select -->
          <div class="field-group full-width">
            <label class="field-label">Book Series <span class="optional">(optional)</span></label>
            <SearchableSelect
              v-model="form.series"
              :options="seriesList"
              placeholder="Select a series or leave empty..."
            />
          </div>

        </div>

        <!-- Chapters Section -->
        <div class="chapters-section">
          <div class="chapters-header">
            <div class="chapters-title-area">
              <h2 class="section-title">Content</h2>
              <span class="chapter-count-badge">{{ chapters.length }} {{ chapters.length === 1 ? 'chapter' : 'chapters' }}</span>
            </div>
            <button type="button" class="add-chapter-btn" @click="addChapter">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2">
                <line x1="12" y1="5" x2="12" y2="19"/>
                <line x1="5" y1="12" x2="19" y2="12"/>
              </svg>
              New Chapter
            </button>
          </div>

          <div class="chapters-list">
            <div
              v-for="(chapter, index) in chapters"
              :key="chapter.id"
              class="chapter-card"
              :class="{ 'chapter-card-active': activeChapter === index }"
            >
              <div class="chapter-card-header" @click="toggleChapter(index)">
                <div class="chapter-meta">
                  <div class="chapter-number">{{ index + 1 }}</div>
                  <input
                    v-if="chapters.length > 1"
                    v-model="chapter.title"
                    type="text"
                    class="chapter-title-input"
                    :placeholder="`Chapter ${index + 1} title...`"
                    @click.stop
                  />
                  <span v-else class="chapter-single-label">Book Content</span>
                </div>
                <div class="chapter-actions">
                  <span class="char-count">{{ chapter.content.length }} chars</span>
                  <button
                    v-if="chapters.length > 1"
                    type="button"
                    class="chapter-delete-btn"
                    title="Remove chapter"
                    @click.stop="removeChapter(index)"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <polyline points="3 6 5 6 21 6"/>
                      <path d="M19 6l-1 14H6L5 6"/>
                      <path d="M10 11v6M14 11v6"/>
                      <path d="M9 6V4h6v2"/>
                    </svg>
                  </button>
                  <svg
                    class="chevron-icon"
                    :class="{ rotated: activeChapter === index }"
                    width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                  >
                    <polyline points="6 9 12 15 18 9"/>
                  </svg>
                </div>
              </div>

              <div class="chapter-body" :class="{ open: activeChapter === index }">
                <textarea
                  v-model="chapter.content"
                  class="chapter-textarea"
                  :class="{ 'input-error': errors[`chapter_${index}`] }"
                  :placeholder="chapters.length > 1 ? `Write the content for Chapter ${index + 1}...` : 'Write your book content here...'"
                  rows="12"
                  @input="errors[`chapter_${index}`] = ''"
                ></textarea>
                <span v-if="errors[`chapter_${index}`]" class="error-msg">{{ errors[`chapter_${index}`] }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Submit -->
        <div class="form-footer">
          <button type="button" class="btn-secondary" @click="resetForm">Reset</button>
          <button type="submit" class="btn-primary" :disabled="isSubmitting">
            <span v-if="isSubmitting" class="spinner"></span>
            {{ isSubmitting ? 'Publishing...' : 'Publish Book' }}
          </button>
        </div>

        <!-- Success Message -->
        <Transition name="fade">
          <div v-if="submitSuccess" class="success-banner">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
              <polyline points="22 4 12 14.01 9 11.01"/>
            </svg>
            Book published successfully!
          </div>
        </Transition>

        <!-- Error Message -->
        <Transition name="fade">
          <div v-if="submitError" class="error-banner">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2">
              <circle cx="12" cy="12" r="10"/>
              <line x1="12" y1="8" x2="12" y2="12"/>
              <line x1="12" y1="16" x2="12.01" y2="16"/>
            </svg>
            {{ submitError }}
          </div>
        </Transition>

      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import SearchableAuthorSelect from '~/components/books/SearchableAuthorSelect.vue'
import SearchableSelect from '~/components/books/SearchableSelect.vue'
import { labels } from '~/utility/labels'
import GutenbergImport from '~/components/GutenbergImport.vue'

// ─── Runtime config ────────────────────────────────────────────────────────
const props = defineProps({ data: { type: Object, default: null }, sa: { type: Boolean, default: false } })
const loggedInUser = import.meta.client ? JSON.parse(localStorage.getItem("auth-user") || "null") : null
const userLang = ref("en")
const config = useRuntimeConfig()

const authorName = () => {
  const author = props.data?.data || loggedInUser;
  if (author?.fullName) return author.fullName;
  if (author?.firstName || author?.lastName) return [author.firstName || '', author.lastName || ''].filter(Boolean).join(' ')
  return "You";
}

// ─── Remote data (categories & authors from API) ───────────────────────────
const categories = ref([])


onMounted(async () => {
  userLang.value = import.meta.client ? localStorage.getItem("user-lang") || "en" : "en"
  if (!props.sa) form.author = String(props.data?.data?.id || loggedInUser?.id || "")
  try {
    const [catRes] = await Promise.all([
      $fetch(`${config.public.BASE_URL}/categories`),
    ])
    categories.value = (catRes || []).map(c => ({ value: c.id, label: c.label }))
  } catch (e) {
    console.error('Failed to load categories / authors', e)
  }
})

// ─── State ─────────────────────────────────────────────────────────────────
const form = reactive({ title: '', category: '', author: '', series: '' })

// Cover image state
const coverImage = ref('')
const coverPrompt = ref('')
const coverError = ref('')
const isGeneratingCover = ref(false)
const generatingStep = ref('')
const errors = reactive({})
const isSubmitting = ref(false)
const submitSuccess = ref(false)
const submitError = ref('')
const activeChapter = ref(0)

let chapterIdCounter = 1
const chapters = ref([{ id: chapterIdCounter++, title: '', content: '' }])

// ─── Methods ───────────────────────────────────────────────────────────────
function addChapter() {
  chapters.value.push({ id: chapterIdCounter++, title: '', content: '' })
  activeChapter.value = chapters.value.length - 1
}

function removeChapter(index) {
  if (chapters.value.length === 1) return
  chapters.value.splice(index, 1)
  if (activeChapter.value >= chapters.value.length) {
    activeChapter.value = chapters.value.length - 1
  }
}

// ─── Cover Generation ──────────────────────────────────────────────────────
async function generateCover() {
  if (!form.title.trim()) {
    coverError.value = 'Please enter a book title first.'
    return
  }

  coverError.value = ''
  coverImage.value = ''
  coverPrompt.value = ''
  isGeneratingCover.value = true

  try {
    // Step 1: Pollinations free text API generates the image prompt — no API key needed
    generatingStep.value = 'Reading book summary...'

    const contentSummary = chapters.value
      .map((ch, i) => {
        const label = chapters.value.length > 1 ? `Chapter ${i + 1}${ch.title ? ` – ${ch.title}` : ''}` : 'Content'
        return `${label}:\n${ch.content.trim().slice(0, 800)}`
      })
      .join('\n\n')

    const userMessage = `You are a book cover art director. Based on the book details below, write a vivid, detailed image generation prompt for a professional book cover illustration.

Book Title: ${form.title}
Genre/Category: ${form.category || 'Unknown'}
Author: ${form.author || 'Unknown'}
${form.series ? `Series: ${form.series}` : ''}

Book Content Summary:
${contentSummary || '(No content provided yet)'}

Rules:
- Describe the visual scene, mood, lighting, color palette, and art style
- Tailor the style to the genre (painterly for fantasy, stark for thriller, warm for romance)
- Do NOT include any text, title, or words in the image
- Output ONLY the image prompt under 200 words, nothing else`

    const textResponse = await fetch('https://text.pollinations.ai/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        messages: [
          {
            role: 'system',
            content: 'You are a creative book cover art director. Output only the image prompt, nothing else.',
          },
          { role: 'user', content: userMessage },
        ],
        model: 'openai',
        seed: Date.now(),
        private: true,
      }),
    })

    if (!textResponse.ok) throw new Error('Prompt generation failed')

    const rawText = (await textResponse.text()).trim()

    // Pollinations sometimes prepends a deprecation/notice block — strip any lines
    // that look like warning/notice text and keep only the actual image prompt
    const cleanPrompt = rawText
      .split('\n')
      .filter(line => {
        const l = line.trim()
        if (!l) return false
        if (l.startsWith('**') && l.endsWith('**')) return false      // **IMPORTANT NOTICE** style
        if (l.toLowerCase().includes('deprecated')) return false
        if (l.toLowerCase().includes('pollinations')) return false
        if (l.toLowerCase().includes('migrate to')) return false
        if (l.toLowerCase().includes('authenticated users')) return false
        if (l.toLowerCase().includes('anonymous requests')) return false
        if (l.toLowerCase().includes('enter.pollinations.ai')) return false
        if (l.startsWith('⚠️') || l.startsWith('Note:') || l.startsWith('Please')) return false
        return true
      })
      .join(' ')
      .trim()

    if (!cleanPrompt) throw new Error('Received empty prompt from Pollinations')
    const prompt = cleanPrompt
    coverPrompt.value = prompt

    // Step 2: Pollinations free image API generates the cover
    generatingStep.value = 'Generating cover image...'

    const encodedPrompt = encodeURIComponent(
      `book cover art, ${prompt}, professional book cover design, no text, no title, no words, high quality illustration`
    )
    const imageUrl = `https://image.pollinations.ai/prompt/${encodedPrompt}?width=512&height=768&nologo=true&seed=${Date.now()}`

    // Pre-load to confirm image is ready before showing it
    await new Promise((resolve, reject) => {
      const img = new Image()
      img.onload = resolve
      img.onerror = reject
      img.src = imageUrl
    })

    coverImage.value = imageUrl

  } catch (err) {
    console.error(err)
    coverError.value = 'Failed to generate cover. Please try again.'
  } finally {
    isGeneratingCover.value = false
    generatingStep.value = ''
  }
}

// ─── Gutenberg Import ──────────────────────────────────────────────────────
function onGutenbergImport({ title, chapters: importedChapters }) {
  // Pre-fill the title if the field is empty
  if (!form.title.trim()) form.title = title

  // Replace chapters with the imported ones
  chapterIdCounter = 1
  chapters.value = importedChapters.map(ch => ({
    id: chapterIdCounter++,
    title: ch.title,
    content: ch.content,
  }))

  activeChapter.value = 0
}

function toggleChapter(index) {
  activeChapter.value = activeChapter.value === index ? -1 : index
}

function validate() {
  let valid = true
  if (!form.title.trim()) { errors.title = 'Book title is required.'; valid = false }
  if (!form.category) { errors.category = 'Please select a category.'; valid = false }
  if (!form.author) { errors.author = 'Please select an author.'; valid = false }
  chapters.value.forEach((ch, i) => {
    if (!ch.content.trim()) {
      errors[`chapter_${i}`] = 'Chapter content cannot be empty.'
      valid = false
    }
  })
  return valid
}

async function handleSubmit() {
  submitSuccess.value = false
  submitError.value = ''
  if (!validate()) return

  const token = props.data?.token || localStorage.getItem('auth-token')
  if (!token) {
    submitError.value = 'You must be logged in to publish a book.'
    return
  }

  isSubmitting.value = true
  try {
    const payload = {
      title:      form.title.trim(),
      category:   { id: form.category },
      author:     { id: form.author },
      seriesName: form.series || '',
      image:      coverImage.value || 'default_post_image.jpg',
      lang:       userLang.value,
      anonymous:  '',
      chapters:   chapters.value.map(ch => ({
        title:   ch.title.trim(),
        content: ch.content.trim(),
      })),
    }

    const res = await $fetch(`${config.public.BASE_URL}/admin/books/create-chapters`, {
      method:  'POST',
      headers: { Authorization: `Bearer ${token}` },
      body:    payload,
    })

    if (res?.status) {
      submitSuccess.value = true
      setTimeout(() => { submitSuccess.value = false }, 5000)
      resetForm()
    } else {
      submitError.value = res?.message || 'Failed to publish. Please try again.'
    }
  } catch (err) {
    submitError.value = err?.data?.message || err?.message || 'Network error. Please try again.'
  } finally {
    isSubmitting.value = false
  }
}

function resetForm() {
  form.title = ''; form.category = ''; form.author = ''; form.series = ''
  coverImage.value = ''; coverPrompt.value = ''; coverError.value = ''
  chapters.value = [{ id: chapterIdCounter++, title: '', content: '' }]
  activeChapter.value = 0
  Object.keys(errors).forEach(k => delete errors[k])
  submitSuccess.value = false
  submitError.value = ''
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,400;0,600;1,400&family=DM+Sans:wght@300;400;500&display=swap');

*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

.page-wrapper {
  min-height: 100vh;
  background: #f7f5f0;
  padding: 2.5rem 1rem;
  font-family: 'DM Sans', sans-serif;
}

.form-container {
  max-width: 760px;
  margin: 0 auto;
  background: #ffffff;
  border-radius: 20px;
  border: 1px solid #e8e4dc;
  overflow: hidden;
  box-shadow: 0 4px 32px rgba(0,0,0,0.06);
}

.form-header {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 2rem 2.5rem 1.5rem;
  border-bottom: 1px solid #f0ece4;
  background: linear-gradient(135deg, #faf9f6 0%, #f4f0e8 100%);
}

.header-icon {
  width: 52px;
  height: 52px;
  background: #2d2926;
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #e8d9c0;
  flex-shrink: 0;
}

h1 {
  font-family: 'Lora', Georgia, serif;
  font-size: 1.6rem;
  font-weight: 600;
  color: #1e1a16;
  line-height: 1.2;
}

.header-subtitle {
  font-size: 0.85rem;
  color: #8a7f72;
  margin-top: 3px;
  font-weight: 300;
}

form { padding: 2rem 2.5rem; }

.fields-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.25rem;
  margin-bottom: 2rem;
}

.field-group { display: flex; flex-direction: column; gap: 6px; }
.full-width { grid-column: 1 / -1; }

.field-label {
  font-size: 0.8rem;
  font-weight: 500;
  color: #4a4339;
  letter-spacing: 0.04em;
  text-transform: uppercase;
}

.required { color: #c0613a; margin-left: 2px; }
.optional { font-weight: 300; color: #9e9488; font-size: 0.75rem; text-transform: none; letter-spacing: 0; }

.text-input {
  height: 44px;
  padding: 0 14px;
  border: 1.5px solid #e0d9d0;
  border-radius: 10px;
  font-family: 'DM Sans', sans-serif;
  font-size: 0.95rem;
  color: #1e1a16;
  background: #fafaf8;
  transition: border-color 0.2s, box-shadow 0.2s;
  outline: none;
}

.text-input::placeholder { color: #b8b0a5; }
.text-input:focus { border-color: #8b7355; box-shadow: 0 0 0 3px rgba(139,115,85,0.12); background: #fff; }
.text-input.input-error { border-color: #c0613a; }

.error-msg { font-size: 0.78rem; color: #c0613a; margin-top: 2px; }

/* Searchable Select */
:deep(.searchable-select) { position: relative; }

/* Chapters */
.chapters-section { margin-bottom: 2rem; }

.chapters-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1rem;
}

.chapters-title-area { display: flex; align-items: center; gap: 10px; }

.section-title {
  font-family: 'Lora', Georgia, serif;
  font-size: 1.05rem;
  font-weight: 600;
  color: #1e1a16;
}

.chapter-count-badge {
  font-size: 0.75rem;
  font-weight: 500;
  background: #f0ece4;
  color: #6b5f50;
  padding: 3px 10px;
  border-radius: 20px;
}

.add-chapter-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  background: #2d2926;
  color: #e8d9c0;
  border: none;
  border-radius: 10px;
  font-family: 'DM Sans', sans-serif;
  font-size: 0.85rem;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.2s, transform 0.15s;
}

.add-chapter-btn:hover { background: #1a1714; transform: translateY(-1px); }
.add-chapter-btn:active { transform: translateY(0); }

.chapters-list { display: flex; flex-direction: column; gap: 10px; }

.chapter-card {
  border: 1.5px solid #e8e4dc;
  border-radius: 14px;
  overflow: hidden;
  transition: border-color 0.2s;
}

.chapter-card-active { border-color: #c8bfb3; }

.chapter-card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  background: #faf9f6;
  cursor: pointer;
  user-select: none;
  gap: 12px;
}

.chapter-meta { display: flex; align-items: center; gap: 12px; flex: 1; min-width: 0; }

.chapter-number {
  width: 28px;
  height: 28px;
  background: #2d2926;
  color: #e8d9c0;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.8rem;
  font-weight: 500;
  flex-shrink: 0;
}

.chapter-title-input {
  flex: 1;
  border: none;
  background: transparent;
  font-family: 'DM Sans', sans-serif;
  font-size: 0.9rem;
  color: #2d2926;
  outline: none;
  min-width: 0;
}

.chapter-title-input::placeholder { color: #b8b0a5; }

.chapter-single-label {
  font-size: 0.9rem;
  color: #4a4339;
  font-weight: 500;
}

.chapter-actions { display: flex; align-items: center; gap: 8px; flex-shrink: 0; }

.char-count {
  font-size: 0.75rem;
  color: #b8b0a5;
  font-weight: 300;
}

.chapter-delete-btn {
  width: 28px;
  height: 28px;
  border: 1px solid #e0d9d0;
  background: transparent;
  border-radius: 7px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: #a09488;
  transition: background 0.15s, color 0.15s;
}

.chapter-delete-btn:hover { background: #fef2ef; color: #c0613a; border-color: #f5cec4; }

.chevron-icon { color: #a09488; transition: transform 0.25s; }
.chevron-icon.rotated { transform: rotate(180deg); }

.chapter-body {
  max-height: 0;
  overflow: hidden;
  transition: max-height 0.3s ease;
}

.chapter-body.open { max-height: 600px; }

.chapter-textarea {
  display: block;
  width: 100%;
  padding: 16px;
  border: none;
  border-top: 1px solid #f0ece4;
  border-radius: 0;
  font-family: 'Lora', Georgia, serif;
  font-size: 0.95rem;
  line-height: 1.75;
  color: #2d2926;
  background: #ffffff;
  resize: vertical;
  outline: none;
  min-height: 220px;
  transition: background 0.15s;
}

.chapter-textarea::placeholder { color: #c8bfb3; font-style: italic; }
.chapter-textarea:focus { background: #fffffe; }
.chapter-textarea.input-error { background: #fef9f7; }

/* Footer */
.form-footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  padding-top: 1.5rem;
  border-top: 1px solid #f0ece4;
}

.btn-secondary {
  padding: 10px 22px;
  background: transparent;
  border: 1.5px solid #e0d9d0;
  border-radius: 10px;
  font-family: 'DM Sans', sans-serif;
  font-size: 0.9rem;
  font-weight: 500;
  color: #6b5f50;
  cursor: pointer;
  transition: background 0.15s, border-color 0.15s;
}

.btn-secondary:hover { background: #f7f4ee; border-color: #c8bfb3; }

.btn-primary {
  padding: 10px 28px;
  background: #2d2926;
  border: none;
  border-radius: 10px;
  font-family: 'DM Sans', sans-serif;
  font-size: 0.9rem;
  font-weight: 500;
  color: #e8d9c0;
  cursor: pointer;
  transition: background 0.15s, transform 0.15s;
  display: flex;
  align-items: center;
  gap: 8px;
}

.btn-primary:hover:not(:disabled) { background: #1a1714; transform: translateY(-1px); }
.btn-primary:active:not(:disabled) { transform: translateY(0); }
.btn-primary:disabled { opacity: 0.6; cursor: not-allowed; }

.spinner {
  width: 14px;
  height: 14px;
  border: 2px solid rgba(232,217,192,0.3);
  border-top-color: #e8d9c0;
  border-radius: 50%;
  animation: spin 0.7s linear infinite;
}

@keyframes spin { to { transform: rotate(360deg); } }

.success-banner {
  margin-top: 1rem;
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 16px;
  background: #edf7f0;
  border: 1px solid #b8ddc4;
  border-radius: 10px;
  font-size: 0.9rem;
  color: #2a6642;
  font-weight: 500;
}

.fade-enter-active, .fade-leave-active { transition: opacity 0.4s, transform 0.4s; }
.fade-enter-from { opacity: 0; transform: translateY(6px); }
.fade-leave-to { opacity: 0; transform: translateY(-4px); }

.error-banner {
  margin-top: 1rem;
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 16px;
  background: #fef2ef;
  border: 1px solid #f5cec4;
  border-radius: 10px;
  font-size: 0.9rem;
  color: #c0613a;
  font-weight: 500;
}

/* ── Cover section ─────────────────────────────────────── */
.cover-section {
  margin-bottom: 2rem;
  padding-bottom: 2rem;
  border-bottom: 1px solid #f0ece4;
}

.cover-layout {
  display: flex;
  gap: 1.5rem;
  align-items: flex-start;
}

.cover-preview {
  width: 160px;
  min-width: 160px;
  height: 220px;
  border: 1.5px dashed #e0d9d0;
  border-radius: 12px;
  background: #faf9f6;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  transition: border-color 0.2s;
  flex-shrink: 0;
}

.cover-preview.cover-has-image {
  border-style: solid;
  border-color: #e0d9d0;
}

.cover-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}

.cover-empty-text {
  font-size: 0.78rem;
  color: #c8bfb3;
}

.cover-loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  padding: 16px;
  width: 100%;
}

.shimmer-wrap {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.shimmer-bar {
  background: linear-gradient(90deg, #f0ece4 25%, #e8e3da 50%, #f0ece4 75%);
  background-size: 200% 100%;
  border-radius: 4px;
  animation: shimmer 1.4s infinite;
}

@keyframes shimmer {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}

.generating-label {
  font-size: 0.75rem;
  color: #a09488;
  text-align: center;
  font-style: italic;
}

.cover-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 10px;
  display: block;
}

.cover-controls {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding-top: 2px;
}

.btn-generate {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 20px;
  background: #f0ece4;
  border: 1.5px solid #e0d9d0;
  border-radius: 10px;
  font-family: 'DM Sans', sans-serif;
  font-size: 0.88rem;
  font-weight: 500;
  color: #2d2926;
  cursor: pointer;
  transition: background 0.15s, border-color 0.15s, transform 0.15s;
  width: fit-content;
}

.btn-generate:hover:not(:disabled) {
  background: #e8e3da;
  border-color: #c8bfb3;
  transform: translateY(-1px);
}

.btn-generate:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.spinner-dark {
  border-color: rgba(45,41,38,0.2);
  border-top-color: #2d2926;
}

.generate-hint {
  font-size: 0.8rem;
  color: #a09488;
  line-height: 1.5;
  max-width: 320px;
}

.prompt-preview {
  background: #faf9f6;
  border: 1px solid #ede9e0;
  border-radius: 8px;
  padding: 10px 12px;
  max-width: 380px;
}

.prompt-preview-label {
  font-size: 0.72rem;
  font-weight: 500;
  color: #a09488;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: 4px;
}

.prompt-preview-text {
  font-size: 0.8rem;
  color: #5a5048;
  line-height: 1.55;
  font-style: italic;
}

.cover-error {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 0.8rem;
  color: #c0613a;
  padding: 8px 12px;
  background: #fef7f4;
  border: 1px solid #f5cec4;
  border-radius: 8px;
  max-width: 360px;
}

@media (max-width: 600px) {
  form, .form-header { padding-left: 1.25rem; padding-right: 1.25rem; }
  .fields-grid { grid-template-columns: 1fr; }
  .full-width { grid-column: 1; }
  .cover-layout { flex-direction: column; align-items: center; }
  .cover-preview { width: 100%; min-width: unset; height: 240px; }
}
</style>
