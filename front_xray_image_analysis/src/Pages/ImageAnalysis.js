import { Empty, Popover, Button, Avatar, Card } from 'antd';
import { useEffect, useState } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import { UserOutlined } from '@ant-design/icons';

export default function ImageAnalysis() {
    const [userData, setUserData] = useState();
    const navigate = useNavigate();
    const [uploadedImage, setUploadedImage] = useState();
    const [responseData, setResponseData] = useState();

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                if (Cookies.get('token')) {
                    const token = Cookies.get('token');
                    const response = await axios.get('http://127.0.0.1:8000/image_anlysis_app/user_profile/', {
                        headers: {
                            'Authorization': `token ${token}`,
                        },
                    });

                    setUserData(response.data);
                } else {
                    navigate('/');
                }
            } catch (error) {
                console.error('Error fetching user profile:', error);
            }
        };
        fetchUserData();
    }, [])

    const handleLogout = async () => {
        try {
            const result = await Swal.fire({
                icon: 'question',
                title: 'Confirm Logout',
                text: 'Are you sure you want to log out?',
                showCancelButton: true,
                confirmButtonText: 'Yes',
                cancelButtonText: 'No',
            });

            if (result.isConfirmed) {
                const token = Cookies.get('token');
                const response = await axios.post('http://127.0.0.1:8000/image_anlysis_app/logout/', null, {
                    headers: {
                        'Authorization': `token ${token}`,
                    },
                });

                console.log('Logout response:', response);
                Cookies.remove('token');
                // Show a success message
                Swal.fire({
                    icon: 'success',
                    title: 'Logged Out',
                    text: 'You have been successfully logged out.',
                    showConfirmButton: false,
                });

                // Reload the page after showing the message
                window.location.reload();
            }
        } catch (error) {
            console.error('Logout error:', error);
            Swal.fire({
                icon: 'error',
                title: 'error',
                text: error.response.data.detail,

            });
        }
    };

    const imageUploaded = async (e) => {
        const file = e.target.files[0];

        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setUploadedImage(reader.result);

            };
            reader.readAsDataURL(file);
        }
        const token = Cookies.get('token');
        if (file && token) {
            const response = await axios.post('http://127.0.0.1:8000/image_anlysis_app/image_analysis/', { 'image': file }, {
                headers: {
                    'Authorization': `token ${token}`,
                    "Content-Type": "multipart/form-data",
                },
            });
            setResponseData(response.data['output']);
        }
    }

    return (
        <div className='container-fluid p-0'>
            <nav className="navbar navbar-light bg-dark p-0">
                <div className="container-fluid d-flex justify-content-between">
                    <h5 className='text-light'>Welcome, {userData && userData.username}</h5>
                    <Popover content={<button className="btn btn-light" onClick={handleLogout}>
                        Logout&nbsp;
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-box-arrow-right" viewBox="0 0 16 16">
                            <path fill-rule="evenodd" d="M10 12.5a.5.5 0 0 1-.5.5h-8a.5.5 0 0 1-.5-.5v-9a.5.5 0 0 1 .5-.5h8a.5.5 0 0 1 .5.5v2a.5.5 0 0 0 1 0v-2A1.5 1.5 0 0 0 9.5 2h-8A1.5 1.5 0 0 0 0 3.5v9A1.5 1.5 0 0 0 1.5 14h8a1.5 1.5 0 0 0 1.5-1.5v-2a.5.5 0 0 0-1 0z" />
                            <path fill-rule="evenodd" d="M15.854 8.354a.5.5 0 0 0 0-.708l-3-3a.5.5 0 0 0-.708.708L14.293 7.5H5.5a.5.5 0 0 0 0 1h8.793l-2.147 2.146a.5.5 0 0 0 .708.708z" />
                        </svg>
                    </button>} placement="bottomRight" trigger="click">
                        <Button type="link" className="mt-1 mb-3" icon={<Avatar src={userData ? `http://127.0.0.1:8000${userData.profile_img}` : "../login_signup/1.png"} icon={<UserOutlined />} />} style={{ color: 'white' }}>
                            {userData ? userData.username : 'Username'}
                        </Button>
                    </Popover>
                </div>
            </nav>
            <div className='container-fluid bg-light'>
                <div className='mx-5 py-5'>
                    <Card bordered={false} style={{ width: '100%' }}>
                        <div className='row'>
                            <div className='col-9'>
                                <div className="mb-3">
                                    <strong>Name:</strong> {userData ? userData.username : 'username'}
                                </div>
                                <div className="mb-3">
                                    <strong>ID:</strong> {userData ? userData.id : 'ID'}
                                </div>
                                <div className="mb-3">
                                    <strong>Gender:</strong> {userData ? userData.gender : 'gender'}
                                </div>
                                <div className="mb-3">
                                    <strong>Date Of Birth:</strong> {userData ? userData.date_of_birth : 'date of birth'}
                                </div>
                            </div>

                            <div className='col-3'>
                                <img
                                    src={userData ? `http://127.0.0.1:8000${userData.profile_img}` : "../login_signup/1.png"}
                                    alt="user-avatar"
                                    className="d-block rounded"
                                    height="150"
                                    width="150"
                                />
                            </div>
                        </div>
                    </Card>
                </div>
                <div className='row mx-5 text-center'>
                    <div className='col'>
                        <Card bordered={false} style={{ height: 250 }}>
                            <h1 className="m-4">X-ray image analyzer</h1>
                            <div className="button-wrapper m-3">
                                <label
                                    for="upload"
                                    className="btn btn-outline-success"
                                >
                                    <span className="d-none d-sm-block">
                                        Upload Image
                                    </span>
                                    <i className="bx bx-upload d-block d-sm-none"></i>
                                    <input
                                        type="file"
                                        id="upload"
                                        className="account-file-input"
                                        hidden
                                        accept=".jpeg, .jpg, .png"
                                        onChange={imageUploaded}
                                    />

                                </label>

                                <p className="">
                                    Upload your chest x-ray image Here
                                </p>
                            </div>
                        </Card>
                    </div>
                    <div className='col'>
                        <Card bordered={false} style={{ height: 250 }}>
                            {
                                uploadedImage ? (
                                    <img
                                        src={uploadedImage ? uploadedImage : "../login_signup/1.png"}
                                        alt="user-avatar"
                                        className="d-block rounded"
                                        height="200"
                                        width="200"
                                        id="uploadedAvatar"
                                        style={{ margin: 'auto', position: 'relative' }}
                                    />
                                ) : (
                                    <Empty
                                        description={
                                            <h5>
                                                Upload your chest x-ray image Here
                                            </h5>
                                        }
                                    >
                                    </Empty>
                                )}
                        </Card>
                    </div>
                </div>
                <div className='row mx-4 py-5'>
                    <div className='col'>
                        {responseData ?
                            <Card bordered={false}>
                                <div className='row'>
                                    <h1 className='text-center mb-5'>Pathology Report</h1>
                                    <div className='col mx-4'>
                                        {Object.entries(responseData.output_dict).splice(0, 9).map(([pathology, confidence]) => (
                                            <p key={pathology}>{pathology} : {confidence.toFixed(4)}</p>
                                        ))}
                                    </div>
                                    <div className='col'>
                                        {Object.entries(responseData.output_dict).splice(9, 18).map(([pathology, confidence]) => (
                                            <p key={pathology}>{pathology} : {confidence.toFixed(4)}</p>
                                        ))}
                                    </div>
                                </div>
                            </Card>
                            :
                            <></>}
                    </div>
                    <div className='col'>
                        {responseData ?
                            <Card bordered={false}>
                                <div className='col'>
                                    <h1 className='text-center mb-5'>Conclusion</h1>
                                    <p align='justify'>{responseData.explaination}</p>
                                </div>
                            </Card>
                            :
                            <></>}
                    </div>
                </div>
            </div>
        </div>
    )
}