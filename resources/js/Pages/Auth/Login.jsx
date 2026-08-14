// import Checkbox from '@/Components/Checkbox';
// import InputError from '@/Components/InputError';
// import InputLabel from '@/Components/InputLabel';
// import PrimaryButton from '@/Components/PrimaryButton';
// import TextInput from '@/Components/TextInput';
// import GuestLayout from '@/Layouts/GuestLayout';
// import { Head, Link, useForm } from '@inertiajs/react';

// export default function Login({ status, canResetPassword }) {
//     const { data, setData, post, processing, errors, reset } = useForm({
//         email: '',
//         password: '',
//         remember: false,
//     });

//     const submit = (e) => {
//         e.preventDefault();

//         post(route('login'), {
//             onFinish: () => reset('password'),
//         });
//     };

//     return (
//         <GuestLayout>
//             <Head title="Log in" />

//             {status && (
//                 <div className="mb-4 text-sm font-medium text-green-600">
//                     {status}
//                 </div>
//             )}

//             <form onSubmit={submit}>
//                 <div>
//                     <InputLabel htmlFor="email" value="Email" />

//                     <TextInput
//                         id="email"
//                         type="email"
//                         name="email"
//                         value={data.email}
//                         className="mt-1 block w-full"
//                         autoComplete="username"
//                         isFocused={true}
//                         onChange={(e) => setData('email', e.target.value)}
//                     />

//                     <InputError message={errors.email} className="mt-2" />
//                 </div>

//                 <div className="mt-4">
//                     <InputLabel htmlFor="password" value="Password" />

//                     <TextInput
//                         id="password"
//                         type="password"
//                         name="password"
//                         value={data.password}
//                         className="mt-1 block w-full"
//                         autoComplete="current-password"
//                         onChange={(e) => setData('password', e.target.value)}
//                     />

//                     <InputError message={errors.password} className="mt-2" />
//                 </div>

//                 <div className="mt-4 block">
//                     <label className="flex items-center">
//                         <Checkbox
//                             name="remember"
//                             checked={data.remember}
//                             onChange={(e) =>
//                                 setData('remember', e.target.checked)
//                             }
//                         />
//                         <span className="ms-2 text-sm text-gray-600">
//                             Remember me
//                         </span>
//                     </label>
//                 </div>

//                 <div className="mt-4 flex items-center justify-end">
//                     {canResetPassword && (
//                         <Link
//                             href={route('password.request')}
//                             className="rounded-md text-sm text-gray-600 underline hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
//                         >
//                             Forgot your password?
//                         </Link>
//                     )}

//                     <PrimaryButton className="ms-4" disabled={processing}>
//                         Log in
//                     </PrimaryButton>
//                 </div>
//             </form>
//         </GuestLayout>
//     );
// }




import { useState } from 'react';
import InputError from '@/Components/InputError';
import { Head, Link, useForm } from '@inertiajs/react';
import { Eye, EyeOff } from 'lucide-react';

export default function Login({ status, canResetPassword }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    const [showPassword, setShowPassword] = useState(false);

    const submit = (e) => {
        e.preventDefault();

        post(route('login'), {
            onFinish: () => reset('password'),
        });
    };
    return (
        <div className="min-h-screen w-full flex items-center justify-center bg-gray-100 p-6">
            <Head title="Log in" />

            <div className="w-full max-w-5xl bg-white rounded-3xl shadow-xl overflow-hidden flex flex-col md:flex-row">
                {/* Left panel - form */}
                <div className="w-full md:w-1/2 p-10 sm:p-14 flex flex-col justify-center">
                    <h1 className="text-4xl font-extrabold mb-8">
                        <span className="bg-gradient-to-r from-teal-500 to-blue-600 bg-clip-text text-transparent">
                            Log in
                        </span>
                    </h1>

                    {status && (
                        <div className="mb-4 text-sm font-medium text-green-600">
                            {status}
                        </div>
                    )}

                    <form onSubmit={submit} className="space-y-6">
                        <div>
                            <label
                                htmlFor="email"
                                className="block text-sm font-medium text-gray-800 mb-2"
                            >
                                Email address
                            </label>
                            <input
                                id="email"
                                type="email"
                                name="email"
                                placeholder="abc@xyzcom"
                                value={data.email}
                                autoComplete="username"
                                autoFocus
                                onChange={(e) => setData('email', e.target.value)}
                                className="w-full rounded-full border border-teal-300 px-5 py-3 text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-transparent"
                            />
                            <InputError message={errors.email} className="mt-2" />
                        </div>

                        <div>
                            <label
                                htmlFor="password"
                                className="block text-sm font-medium text-gray-800 mb-2"
                            >
                                Password
                            </label>
                            <div className="relative">
                                <input
                                    id="password"
                                    type={showPassword ? 'text' : 'password'}
                                    name="password"
                                    placeholder="••••••••••••"
                                    value={data.password}
                                    autoComplete="current-password"
                                    onChange={(e) => setData('password', e.target.value)}
                                    className="w-full rounded-full border border-gray-300 px-5 py-3 pr-12 text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-transparent"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword((prev) => !prev)}
                                    tabIndex={-1}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-teal-500 transition-colors"
                                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                                >
                                    {showPassword ? (
                                        <EyeOff className="w-5 h-5" />
                                    ) : (
                                        <Eye className="w-5 h-5" />
                                    )}
                                </button>
                            </div>
                            <InputError message={errors.password} className="mt-2" />
                        </div>

                        {/* <div className="flex items-center justify-between text-sm">
                            <label className="flex items-center gap-2 text-gray-600 cursor-pointer select-none">
                                <input
                                    type="checkbox"
                                    name="remember"
                                    checked={data.remember}
                                    onChange={(e) =>
                                        setData('remember', e.target.checked)
                                    }
                                    className="h-4 w-4 rounded border-gray-300 text-teal-500 focus:ring-teal-400"
                                />
                                Remember me
                            </label>

                            {canResetPassword && (
                                <Link
                                    href={route('password.request')}
                                    className="font-medium text-gray-700 hover:text-teal-600"
                                >
                                    Forgot Password ?
                                </Link>
                            )}
                        </div> */}

                        <button
                            type="submit"
                            disabled={processing}
                            className="w-full rounded-full py-3 text-white font-semibold text-base bg-gradient-to-r from-teal-400 to-blue-600 hover:opacity-90 transition-opacity shadow-md disabled:opacity-60 disabled:cursor-not-allowed"
                        >
                            Log in
                        </button>
                    </form>
                </div>

                {/* Right panel - promo */}
                <div className="w-full md:w-1/2 relative bg-gradient-to-br from-teal-400 via-teal-500 to-blue-700 flex items-center justify-center min-h-[420px] md:min-h-[560px]">
                    <div className="absolute inset-0 rounded-l-[50%] bg-white/10" />
                    <div className="relative z-10 max-w-xs px-8 text-white">
                        <h2 className="text-3xl font-bold mb-4">Sapkota Vehicle</h2>
                        <p className="text-sm leading-relaxed text-white/90 mb-8">
                            Lorem ipsum dolor sit amet consectetur. Aliquam
                            proin integer ac ultrices semper neque
                            scelerisque. Ut neque facilisi commodo senectus.
                            Tellus scelerisque gravida facilisis purus
                            tincidunt elefend consequat aliquam. Amet
                            imperdiet pretium lobortis porta.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}


// import InputError from '@/Components/InputError';
// import { Head, Link, useForm } from '@inertiajs/react';

// export default function Login({ status, canResetPassword }) {
//     const { data, setData, post, processing, errors, reset } = useForm({
//         email: '',
//         password: '',
//         remember: false,
//     });

//     const submit = (e) => {
//         e.preventDefault();

//         post(route('login'), {
//             onFinish: () => reset('password'),
//         });
//     };
//     return (
//         <div className="min-h-screen w-full flex items-center justify-center bg-gray-100 p-6">
//             <Head title="Log in" />

//             <div className="w-full max-w-5xl bg-white rounded-3xl shadow-xl overflow-hidden flex flex-col md:flex-row">
//                 {/* Left panel - form */}
//                 <div className="w-full md:w-1/2 p-10 sm:p-14 flex flex-col justify-center">
//                     <h1 className="text-4xl font-extrabold mb-8">
//                         <span className="bg-gradient-to-r from-teal-500 to-blue-600 bg-clip-text text-transparent">
//                             Log in
//                         </span>
//                     </h1>

//                     {status && (
//                         <div className="mb-4 text-sm font-medium text-green-600">
//                             {status}
//                         </div>
//                     )}

//                     <form onSubmit={submit} className="space-y-6">
//                         <div>
//                             <label
//                                 htmlFor="email"
//                                 className="block text-sm font-medium text-gray-800 mb-2"
//                             >
//                                 Email address
//                             </label>
//                             <input
//                                 id="email"
//                                 type="email"
//                                 name="email"
//                                 placeholder="abc@xyzcom"
//                                 value={data.email}
//                                 autoComplete="username"
//                                 autoFocus
//                                 onChange={(e) => setData('email', e.target.value)}
//                                 className="w-full rounded-full border border-teal-300 px-5 py-3 text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-transparent"
//                             />
//                             <InputError message={errors.email} className="mt-2" />
//                         </div>

//                         <div>
//                             <label
//                                 htmlFor="password"
//                                 className="block text-sm font-medium text-gray-800 mb-2"
//                             >
//                                 Password
//                             </label>
//                             <input
//                                 id="password"
//                                 type="password"
//                                 name="password"
//                                 placeholder="••••••••••••"
//                                 value={data.password}
//                                 autoComplete="current-password"
//                                 onChange={(e) => setData('password', e.target.value)}
//                                 className="w-full rounded-full border border-gray-300 px-5 py-3 text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-transparent"
//                             />
//                             <InputError message={errors.password} className="mt-2" />
//                         </div>

//                         {/* <div className="flex items-center justify-between text-sm">
//                             <label className="flex items-center gap-2 text-gray-600 cursor-pointer select-none">
//                                 <input
//                                     type="checkbox"
//                                     name="remember"
//                                     checked={data.remember}
//                                     onChange={(e) =>
//                                         setData('remember', e.target.checked)
//                                     }
//                                     className="h-4 w-4 rounded border-gray-300 text-teal-500 focus:ring-teal-400"
//                                 />
//                                 Remember me
//                             </label>

//                             {canResetPassword && (
//                                 <Link
//                                     href={route('password.request')}
//                                     className="font-medium text-gray-700 hover:text-teal-600"
//                                 >
//                                     Forgot Password ?
//                                 </Link>
//                             )}
//                         </div> */}

//                         <button
//                             type="submit"
//                             disabled={processing}
//                             className="w-full rounded-full py-3 text-white font-semibold text-base bg-gradient-to-r from-teal-400 to-blue-600 hover:opacity-90 transition-opacity shadow-md disabled:opacity-60 disabled:cursor-not-allowed"
//                         >
//                             Log in
//                         </button>
//                     </form>
//                 </div>

//                 {/* Right panel - promo */}
//                 <div className="w-full md:w-1/2 relative bg-gradient-to-br from-teal-400 via-teal-500 to-blue-700 flex items-center justify-center min-h-[420px] md:min-h-[560px]">
//                     <div className="absolute inset-0 rounded-l-[50%] bg-white/10" />
//                     <div className="relative z-10 max-w-xs px-8 text-white">
//                         <h2 className="text-3xl font-bold mb-4">Sapkota Vehicle</h2>
//                         <p className="text-sm leading-relaxed text-white/90 mb-8">
//                             Lorem ipsum dolor sit amet consectetur. Aliquam
//                             proin integer ac ultrices semper neque
//                             scelerisque. Ut neque facilisi commodo senectus.
//                             Tellus scelerisque gravida facilisis purus
//                             tincidunt elefend consequat aliquam. Amet
//                             imperdiet pretium lobortis porta.
//                         </p>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// }