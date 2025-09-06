<template>
  <footer class="bg-white border-t border-gray-200">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-8">
        <!-- Brand -->
        <div class="col-span-1 md:col-span-2">
          <div class="flex items-center space-x-2 mb-4">
            <div class="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <span class="text-white font-bold text-lg">E</span>
            </div>
            <span class="text-xl font-bold text-gray-900">English Learning</span>
          </div>
          <p class="text-gray-600 text-sm max-w-md">
            Master English with interactive lessons, exercises, and personalized learning paths. 
            Start your journey to fluency today.
          </p>
        </div>

        <!-- Quick Links -->
        <div>
          <h3 class="text-sm font-semibold text-gray-900 mb-4">Quick Links</h3>
          <ul class="space-y-2">
            <li>
              <NuxtLink to="/lessons" class="text-gray-600 hover:text-blue-600 text-sm">
                All Lessons
              </NuxtLink>
            </li>
            <li>
              <NuxtLink to="/progress" class="text-gray-600 hover:text-blue-600 text-sm">
                Your Progress
              </NuxtLink>
            </li>
            <li>
              <NuxtLink to="/about" class="text-gray-600 hover:text-blue-600 text-sm">
                About Us
              </NuxtLink>
            </li>
          </ul>
        </div>

        <!-- Support -->
        <div>
          <h3 class="text-sm font-semibold text-gray-900 mb-4">Support</h3>
          <ul class="space-y-2">
            <li>
              <NuxtLink to="/help" class="text-gray-600 hover:text-blue-600 text-sm">
                Help Center
              </NuxtLink>
            </li>
            <li>
              <NuxtLink to="/contact" class="text-gray-600 hover:text-blue-600 text-sm">
                Contact Us
              </NuxtLink>
            </li>
            <li>
              <NuxtLink to="/privacy" class="text-gray-600 hover:text-blue-600 text-sm">
                Privacy Policy
              </NuxtLink>
            </li>
          </ul>
        </div>
      </div>

      <div class="mt-8 pt-8 border-t border-gray-200">
        <p class="text-center text-gray-500 text-sm">
          © {{ new Date().getFullYear() }} English Learning. All rights reserved.
        </p>
      </div>
    </div>
  </footer>
</template>
