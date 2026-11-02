import {defineConfig} from 'vite';
import {fileURLToPath} from 'node:url';
export default defineConfig({root:fileURLToPath(new URL('../../',import.meta.url)),server:{host:'127.0.0.1',port:5173,strictPort:true,fs:{deny:['.env','.env.*','**/.git/**','**/.data/**','**/.data-demo/**','**/.data-dev/**','**/*.sqlite*','*.crt','*.pem']},proxy:{'/api':{target:'http://127.0.0.1:3000'},'/socket.io':{target:'http://127.0.0.1:3000',ws:true}}},build:{outDir:'dist/web',emptyOutDir:true,target:'esnext',rollupOptions:{external:['/socket.io/socket.io.esm.min.js']}}});
