# About the project

Social media web app made with React, Typescript and Vite.

# What is used inside the project

-   React JS (with TypeScript and Vite),
-   Appwrite
-   Tailwind CSS
-   Tailwindcss Animate
-   Tailwindcss Container Queries
-   Shadcn/ui css library
-   React query

# NPM packages

-   `npm i appwrite --save`
-   `npm install -D tailwindcss`
-   `npx tailwindcss init`
-   `npm i -D tailwindcss-animate`
-   `npm i @tailwindcss/container-queries`
-   `npm i @tanstack/react-query`

# Install Shadcn/ui css library

1. Create project
2. Add Tailwind and its configuration
    `npm install -D tailwindcss postcss autoprefixer`
    `npx tailwindcss init -p`
3. Edit tsconfig.json file
    `{
        "compilerOptions": {
            // ...
            "baseUrl": ".",
            "paths": {
              "@/*": [
                "./src/*"
              ]
            }
            // ...
        }
    }`
4. Update vite.config.ts
   Terminal
   `npm i -D @types/node`

   Vite.config.ts file
   `import path from "path"
    import react from "@vitejs/plugin-react"
    import { defineConfig } from "vite"`
     
   `export default defineConfig({
      plugins: [react()],
      resolve: {
        alias: {
          "@": path.resolve(__dirname, "./src"),
        },
      },
    })`

5. Run the CLI
    `npx shadcn-ui@latest init`

6. Configure components.json
    `Would you like to use TypeScript (recommended)? no / yes
    Which style would you like to use? › Default
    Which color would you like to use as base color? › Slate
    Where is your global CSS file? › › src/index.css
    Do you want to use CSS variables for colors? › no / yes
    Where is your tailwind.config.js located? › tailwind.config.js
    Configure the import alias for components: › @/components
    Configure the import alias for utils: › @/lib/utils
    Are you using React Server Components? › no / yes (no)`

7. That's it
    `npx shadcn-ui@latest add button`

   `**import { Button } from "@/components/ui/button**"
    export default function Home() {
      return (
        <div>
          **<Button>Click me</Button>**
        </div>
      )
    }`

   
