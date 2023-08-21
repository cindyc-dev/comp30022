import Image from 'next/image'
import bg from "public/background.png";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="hero min-h-screen bg-base-200  first-letter:">
      <div className="hero-content flex-col lg:flex-row-reverse">
        <div className="p-10 text-center lg:text-left">
          <h1 className="text-5xl font-bold">PotatoCRM</h1>
          <p className="py-6">
            
            Provident cupiditate voluptatem et in. Quaerat fugiat ut assumenda
            excepturi exercitationem quasi. In deleniti eaque aut repudiandae et
            a id nisi.
          </p>
        </div>
        <div className="card w-full max-w-sm flex-shrink-0 bg-base-100 shadow-2xl">
          {/* Log In / Sign Up Form */}
          {children}
        </div>
      </div>
    </div>
  );
}
