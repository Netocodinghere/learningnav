import { faRedo } from "@fortawesome/free-solid-svg-icons";



import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
export default function ConfirmationPage() {
 return (
    <div className="flex items-center justify-center h-screen p-4 bg-transparent">
      <div className="bg-cyan-400/10 backdrop-blur-xl p-8 rounded-lg shadow-md max-w-md w-full text-center">
        <h1 className="text-2xl text-white font-bold mb-4">Email Confirmation</h1>
        <p className="text-gray-200 mb-6">
          Thank you for signing up! Please check your email to confirm your account.
        </p>
        <p className="text-gray-100 text-sm">
          {`If you don't see the email, please check your spam folder.`}
        </p>
        <a href="resend-confirmation" className="mt-4 gap-2 text-center text-blue-600 items-center justify-center flex"><span> Resend Confirmation Email</span> <FontAwesomeIcon className="size-3" icon={faRedo}/> </a>
      </div>
    </div>
  );

}