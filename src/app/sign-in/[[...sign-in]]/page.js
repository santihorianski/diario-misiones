export const runtime = 'edge';
import { SignIn } from '@clerk/nextjs';

export default function SignInPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 bg-gradient-to-br from-slate-900 to-slate-800">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] rounded-full bg-blue-500/10 blur-3xl"></div>
        <div className="absolute top-[60%] -right-[10%] w-[40%] h-[40%] rounded-full bg-emerald-500/10 blur-3xl"></div>
      </div>
      
      <div className="relative z-10 w-full max-w-md p-6 flex flex-col items-center">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-white mb-2">MisionesYa</h1>
          <p className="text-slate-400">Panel de Administración</p>
        </div>
        
        <div className="w-full shadow-2xl rounded-2xl overflow-hidden">
          <SignIn 
            routing="path" 
            path="/sign-in" 
            appearance={{
              elements: {
                rootBox: "w-full flex justify-center",
                card: "w-full max-w-md border-0 shadow-none",
                headerTitle: "text-gray-900",
                headerSubtitle: "text-gray-500",
                socialButtonsBlockButton: "border-gray-200 hover:bg-gray-50",
                formButtonPrimary: "bg-blue-600 hover:bg-blue-700 text-white font-medium",
                footerActionLink: "text-blue-600 hover:text-blue-700 font-medium"
              }
            }}
          />
        </div>
      </div>
    </div>
  );
}
