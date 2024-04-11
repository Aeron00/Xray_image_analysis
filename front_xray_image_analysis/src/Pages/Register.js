import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import validation from './validation/RegistrationValidation'
import axios from 'axios';
import Swal from 'sweetalert2';

export default function Register() {
    const navigate = useNavigate();
    const navigatetolanding = () => {
        navigate('/');
    };

    const [values, setValues] = useState({
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
        profile_img: "",
        dateOfBirth: "",
        gender: "",
    });
    const [imageprev, setimageprev] = useState();

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setConfirmShowPassword] = useState(false);

    const [errors, setErrors] = useState({});

    const handleInput = (event) => {
        const { name, value } = event.target;
        setValues((prev) => ({ ...prev, [name]: value }));

        if (!event.target.matches(':focus')) {
            const validationErrors = validation({ ...values, [name]: value });
            setErrors((prevErrors) => ({
                ...prevErrors,
                [name]: validationErrors[name],
            }));
        }
    };

    const imageUpload = (e) => {
        const file = e.target.files[0];
        setValues((prev) => ({ ...prev, profile_img: file }));

        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setimageprev(reader.result);

            };
            reader.readAsDataURL(file);
        }
    }

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };
    const toggleConfirmPasswordVisibility = () => {
        setConfirmShowPassword(!showConfirmPassword);
    };
    const passwordInputType = showPassword ? "text" : "password";
    const ConfirmpasswordInputType = showConfirmPassword ? "text" : "password";

    const handleSubmit = async (event) => {
        event.preventDefault();
        const validationErrors = validation(values);
        setErrors(validationErrors);

        if (Object.keys(validationErrors).length === 0) {
            try {
                await axios.post('http://127.0.0.1:8000/image_anlysis_app/register/', values, {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                });
                navigate('/');
            } catch (error) {
                console.log(error)
                Swal.fire({
                    icon: 'error',
                    title: error.response.data,

                });
            }
        }
    }


    return (
        <>
            <section className="bg-light">
                <div className="container py-3 py-md-5 h-100">
                    <div className="row d-flex justify-content-center align-items-center h-100">
                        <div className="col col-xl-10">
                            <div className="card" style={{ borderRadius: '1rem' }}>
                                <div className="row g-0">
                                    <div className="col-md-6 col-lg-5 d-none d-md-block">
                                        <img
                                            src="..\login_signup\signup_page.png"
                                            alt="sign form"
                                            className="img-fluid"
                                            style={{ borderRadius: '1rem 0 0 1rem', height: '100%' }}
                                        />
                                    </div>
                                    <div className="col-md-6 col-lg-6 d-flex align-items-center">
                                        <div className="card-body p-2 p-md-5 text-black">
                                            <form onSubmit={handleSubmit}>
                                                <div className="d-flex align-items-center mb-2 pb-1">
                                                    <i className="fas fa-cubes fa-2x me-2" style={{ color: '#ff6219' }}></i>
                                                    <span className="h1 fw-bold mb-0">Register</span>
                                                </div>
                                                <h5 className="fw-normal mb-2 pb-2" style={{ letterSpacing: '1px' }}>
                                                    Signup your account
                                                </h5>
                                                <div className="form-outline mb-2">
                                                    <label className="form-label" htmlFor="form2Example17">
                                                        User Name
                                                    </label>
                                                    <input
                                                        type="text"

                                                        className="form-control form-control-sm"
                                                        id="username"
                                                        name="username"
                                                        placeholder="Enter your username"
                                                        autoComplete="off"
                                                        onChange={handleInput}
                                                        onBlur={handleInput} // Trigger validation when focus is lost

                                                    />
                                                    {errors.username && (
                                                        <p style={{ color: "#d32f2f", fontSize: "0.75rem", marginTop: "3px", marginRight: "14px", marginBottom: "0", marginLeft: "14px" }}>{errors.username}</p>
                                                    )}
                                                </div>
                                                <div className="form-outline mb-2">
                                                    <label className="form-label" htmlFor="form2Example17">
                                                        Email address
                                                    </label>
                                                    <input
                                                        type="email"
                                                        className="form-control form-control-sm"
                                                        id="email"
                                                        name="email"
                                                        placeholder="Enter your email"
                                                        onChange={handleInput}
                                                        onBlur={handleInput} // Trigger validation when focus is lost
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
                                                            id="password"
                                                            name="password"
                                                            placeholder="&#xb7;&#xb7;&#xb7;&#xb7;&#xb7;&#xb7;&#xb7;&#xb7;&#xb7;&#xb7;&#xb7;&#xb7;"
                                                            aria-describedby="password"
                                                            onChange={handleInput}
                                                            onBlur={handleInput} // Trigger validation when focus is lost
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
                                                <div className="form-outline mb-2">
                                                    <label className="form-label" htmlFor="confirmPassword">
                                                        Confirm Password
                                                    </label>
                                                    <div className="input-group input-group-merge">

                                                        <input
                                                            type={ConfirmpasswordInputType}
                                                            className="form-control form-control-sm"
                                                            id="confirmPassword"
                                                            name="confirmPassword"
                                                            placeholder="Confirm your password"
                                                            onChange={handleInput}
                                                            onBlur={handleInput} // Trigger validation when focus is lost

                                                        />
                                                        <span
                                                            className="input-group-text cursor-pointer"
                                                            onClick={toggleConfirmPasswordVisibility}
                                                        >
                                                            <i
                                                                className={`bx ${showConfirmPassword
                                                                    ? "bx-show"
                                                                    : "bx-hide"
                                                                    }`}
                                                            ></i>
                                                        </span>
                                                    </div>

                                                    {errors.confirmPassword && (
                                                        <p style={{ color: "#d32f2f", fontSize: "0.75rem", marginTop: "3px", marginRight: "14px", marginBottom: "0", marginLeft: "14px" }}>{errors.confirmPassword}</p>
                                                    )}
                                                </div>
                                                <div className="form-outline mb-2">
                                                    <label className="form-label" htmlFor="dateOfBirth">
                                                        Date of Birth
                                                    </label>
                                                    <input
                                                        type="date"
                                                        className="form-control form-control-sm"
                                                        id="dateOfBirth"
                                                        name="date_of_birth"
                                                        onChange={handleInput}
                                                        onBlur={handleInput}
                                                    />
                                                    {errors.dateOfBirth && (
                                                        <p style={{ color: "#d32f2f", fontSize: "0.75rem", marginTop: "3px", marginRight: "14px", marginBottom: "0", marginLeft: "14px" }}>{errors.dateOfBirth}</p>
                                                    )}
                                                </div>
                                                <div className="form-outline mb-2">
                                                    <label className="form-label" htmlFor="gender">
                                                        Gender
                                                    </label>
                                                    <select
                                                        className="form-select form-select-sm"
                                                        id="gender"
                                                        name="gender"
                                                        onChange={handleInput}
                                                        onBlur={handleInput}
                                                    >
                                                        <option value="">Select gender</option>
                                                        <option value="M">Male</option>
                                                        <option value="F">Female</option>
                                                        <option value="O">Other</option>
                                                    </select>
                                                    {errors.gender && (
                                                        <p style={{ color: "#d32f2f", fontSize: "0.75rem", marginTop: "3px", marginRight: "14px", marginBottom: "0", marginLeft: "14px" }}>{errors.gender}</p>
                                                    )}
                                                </div>
                                                <div className="d-flex align-items-start align-items-sm-center gap-4 my-3">
                                                    <img
                                                        src={imageprev ? imageprev : "../login_signup/1.png"}
                                                        alt="user-avatar"
                                                        className="d-block rounded"
                                                        height="70"
                                                        width="70"
                                                        id="uploadedAvatar"
                                                    />
                                                    <div className="button-wrapper">
                                                        <label
                                                            for="upload"
                                                            className="btn btn-primary"
                                                        >
                                                            <span className="d-none d-sm-block">
                                                                Upload Profile Picture
                                                            </span>
                                                            <i className="bx bx-upload d-block d-sm-none"></i>
                                                            <input
                                                                type="file"
                                                                id="upload"
                                                                className="account-file-input"
                                                                hidden
                                                                accept=".jpeg, .jpg, .png"
                                                                onChange={imageUpload}
                                                            />

                                                        </label>

                                                        <p className="text-muted mb-0">
                                                            Allowed JPG, GIF or PNG. Max size of 800K
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="pt-1 mb-2">
                                                    <button className="btn btn-dark btn-sm btn-block" type="submit">
                                                        Register
                                                    </button>

                                                    <button className="btn btn-dark btn-sm btn-block" style={{ marginLeft: '10px' }} type="button" onClick={navigatetolanding}>
                                                        Back
                                                    </button>
                                                </div>


                                                <p className="mb-2 pb-md-2" style={{ color: '#393f81' }}>
                                                    Already have an account?{' '}
                                                    <Link to="/" style={{ color: '#393f81' }}>
                                                        Login here
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
        </>
    );
}
