import { toast, Toaster, ToastBar } from 'react-hot-toast';
import {FaX} from 'react-icons/fa6';

const Toast = () => {
    return  (
        <Toaster
            position="top-right"
            reverseOrder={false}
            gutter={8}>
            {(t) => (
                <ToastBar toast={t}>
                    {({ icon, message }) => (
                        <>
                            {icon}
                            {message}
                            {t.type !== 'loading' && (
                                <button onClick={() => toast.dismiss(t.id)}><FaX/></button>
                            )}
                        </>
                    )}
                </ToastBar>
            )}
        </Toaster>
    )
}

export default Toast;