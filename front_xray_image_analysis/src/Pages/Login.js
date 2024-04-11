import { useState } from 'react';
import { Link } from 'react-router-dom';
import validation from './validation/LoginValidation';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Cookies from 'js-cookie';
import Swal from 'sweetalert2';
export default function Login() {

    const navigate = useNavigate();

    const navigatetolanding = () => {
        navigate('/');
    };

    const [errors, setErrors] = useState({});

    const [values, setValues] = useState({
        email: '',
        password: ''
    });
    const [showPassword, setShowPassword] = useState(false);

    const handleInput = (event) => {
        const { name, value } = event.target;

        // Dynamic validation
        const validationErrors = validation({ ...values, [name]: value });

        // Update error state dynamically only if the field is not focused
        if (!event.target.matches(':focus')) {
            setErrors((prevErrors) => ({
                ...prevErrors,
                [name]: validationErrors[name],
            }));
        }

        setValues((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };
    const passwordInputType = showPassword ? "text" : "password";
    
    const handleSubmit = async (event) => {
        event.preventDefault();
        const validationErrors = validation(values);
        setErrors(validationErrors);

        if (Object.keys(validationErrors).length === 0) {
            try {
                const response = await axios.post('http://127.0.0.1:8000/image_anlysis_app/login/', values);

                const token = response.data.token;
                var inFifteenMinutes = new Date(new Date().getTime() + 24 * 60 * 60 * 1000);
                Cookies.set('token', token, { expires: inFifteenMinutes, secure: true });
                navigate('/ImageAnalysis');

            } catch (error) {
                Swal.fire({
                    icon: 'error',
                    title: error.response.data.error,
                });
            }
        }
    }
    return (
        <section className="vh-100">
            <div className="container py-3 py-md-5 h-100">
                <div className="row d-flex justify-content-center align-items-center h-100">
                    <div className="col col-xl-10">
                        <div className="card" style={{ borderRadius: '1rem' }}>
                            <div className="row g-0">
                                <div className="col-md-6 col-lg-5 d-none d-md-block">
                                    <img
                                        src="..\login_signup\login_page.jpg"
                                        alt="login form"
                                        className="img-fluid h-100" // Adjusted height here
                                        style={{ borderRadius: '1rem 0 0 1rem', objectFit: 'cover' }}
                                    />
                                </div>
                                <div className="col-md-6 col-lg-6 d-flex align-items-center">
                                    <div className="card-body p-2 p-md-5 text-black">
                                        <form action="" onSubmit={handleSubmit} noValidate autoComplete="off">
                                            <div className="d-flex align-items-center mb-2 pb-1">
                                                <i className="fas fa-cubes fa-2x me-2" style={{ color: '#ff6219' }}></i>
                                                <span className="h1 fw-bold mb-0">Log In</span>
                                            </div>
                                            <h5 className="fw-normal mb-2 pb-2" style={{ letterSpacing: '1px' }}>
                                                Sign into your account
                                            </h5>
                                            <div className="form-outline mb-2">
                                                <label className="form-label" htmlFor="form2Example17">
                                                    Email address
                                                </label>
                                                <input
                                                    type="email"

                                                    className="form-control form-control-sm"
                                                    name="email"
                                                    onChange={handleInput}
                                                    onBlur={handleInput} // Trigger validation when focus is lost
                                                    value={values.email}
                                                    placeholder="Enter a valid email address"
                                                />

                                                {errors.email && (
                                                    <p style={{ color: "#d32f2f", fontSize: "0.75rem", marginTop: "3px", marginRight: "14px", marginBottom: "0", marginLeft: "14px" }}>{errors.email}</p>
                                                )}
                                            </div>
                                            <div className="form-outline mb-2">
                                                <label className="form-label" htmlFor="form2Example27">
                                                    Password
                                                </label>
                                                <div className="input-group input-group-merge">
                                                    <input
                                                        type={passwordInputType}
                                                        className="form-control form-control-sm"
                                                        name="password"
                                                        onChange={handleInput}
                                                        onBlur={handleInput} // Trigger validation when focus is lost
                                                        value={values.password}
                                                        placeholder="Enter a valid password"
                                                    />
                                                    <span
                                                        className="input-group-text cursor-pointer"
                                                        onClick={togglePasswordVisibility}
                                                    >
                                                        <i
                                                            className={`bx ${showPassword
                                                                ? "bx-show"
                                                                : "bx-hide"
                                                                }`}
                                                        ></i>
                                                    </span>
                                                </div>
                                                {errors.password && (
                                                    <p style={{ color: "#d32f2f", fontSize: "0.75rem", marginTop: "3px", marginRight: "14px", marginBottom: "0", marginLeft: "14px" }}>{errors.password}</p>
                                                )}
                                            </div>
                                            <div className="pt-1 mb-2">
                                                <button className="btn btn-dark btn-sm btn-block" type="submit">
                                                    Login
                                                </button>
                                                <button className="btn btn-dark btn-sm btn-block" style={{ marginLeft: '10px' }} type="button" onClick={navigatetolanding}>
                                                    Back
                                                </button>
                                            </div>
                                            <a className="small text-muted" href="#!">
                                                Forgot password?
                                            </a>
                                            <p className="mb-2 pb-md-2" style={{ color: '#393f81' }}>
                                                Don't have an account?{' '}
                                                <Link to="/Register" style={{ color: '#393f81' }}>
                                                    Register here
                                                </Link>
                                            </p>
                                        </form>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
