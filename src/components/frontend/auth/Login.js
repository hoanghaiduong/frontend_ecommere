import axios from "axios";

import {
  MDBBtn,
  MDBCard, MDBCardBody,
  MDBCardFooter, MDBCardHeader,
  MDBCardText, MDBCardTitle, MDBIcon, MDBInput
} from "mdb-react-ui-kit";
import React, { useState } from "react";
import { useCookies } from "react-cookie";
import { useHistory } from "react-router";
import Swal from "sweetalert2";
import Navbar from "../../../layouts/frontend/Navbar";




function Login() {
  const Toast = Swal.mixin({
    toast: true,
    position: 'top-right',
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    didOpen: (toast) => {
      toast.addEventListener('mouseenter', Swal.stopTimer)
      toast.addEventListener('mouseleave', Swal.resumeTimer)
    }
  })
  const [cookies, setCookie, removeCookie] = useCookies([]);
  const history = useHistory('');
  const [loginInput, setLoginInput] = useState({
    email: '',
    password: '',
    error_list: [],
  });
  const [btnclick, setBtnClick] = useState(false); //định nghĩ event btn click
  const handleInput = (e) => {
    e.persist();
    setLoginInput({
      ...loginInput,
      [e.target.name]: e.target.value,
    })
  }
  const loginSubmit = (e) => {
    e.preventDefault();
    let timerInterval;
    Swal.fire({
      title: 'Đang xử lý !',
      html: 'Chờ <b></b> miliseconds.',
      timer: 1000,
      timerProgressBar: true,
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading()
        const b = Swal.getHtmlContainer().querySelector('b')
        timerInterval = setInterval(() => {
          b.textContent = Swal.getTimerLeft()
        }, 50)
      },
      willClose: () => {
        clearInterval(timerInterval)
      }
    }).then(() => { setBtnClick(true); });
    const data = {
      email: loginInput.email,
      password: loginInput.password,
    }
    axios.get("/sanctum/csrf-cookie")
      .then(() => {
        axios.post(`api/login`, data).then((res) => {
          const result = res.data;
          setBtnClick(false);
          if (result.status === 200) {
            Swal.fire({
              icon: "success",
              title: result.message,
            }).then(() => {
              setCookie('auth_token', result.token);
              setCookie('auth_name', result.username);
              //{"redirect về "/"}
              history.push('/');

            });
            setBtnClick(false);
          }
          else if (result.status === 401) {
            Swal.fire({
              icon: 'error',
              title: 'Thất bại',
              text: result.message
            })
          }
          else {
            setLoginInput({
              ...loginInput,
              error_list: result.message,
            })
            setBtnClick(false);
          }
        }).catch((error) => {
          Toast.fire({
            icon: 'error',
            title: 'Thất bại !',
            text: error,
            allowOutsideClick: false,
          }).then(() => {
            setBtnClick(false);
            console.log(error);
          });
        })
      }).catch((error) => {
        Toast.fire({
          icon: 'error',
          title: 'Thất bại !',
          text: error,
          allowOutsideClick: false,
        }).then(() => {
          setBtnClick(false);
          console.log(error);
        });
      });

  }
  return (
    <>
      <>
        <Navbar />
      </>

      <div className="container py-5">
        <div className="row justify-content-center align-items-center">
          <div className="col-md-7 col-lg-5 mx-auto col-12">
            <MDBCard className="shadow mb-4">
              <MDBCardBody className="my-0 py-3">
                <MDBCardTitle className="text-center mb-0">
                  Đăng nhập
                </MDBCardTitle>
              </MDBCardBody>
            </MDBCard>
            <form onSubmit={loginSubmit}>
              <MDBCard className="shadow ">
                <MDBCardBody>
                  <div className="form-group mb-4">
                    <MDBInput
                      label="Email của bạn"
                      name="email"
                      id="typeEmail"
                      type="email"
                      size="lg"
                      value={loginInput.email}
                      onChange={handleInput}
                    />
                    <span className="font-weight-bold text-danger">{loginInput.error_list.email}</span>
                  </div>

                  <div className="form-group mb-4">
                    <MDBInput
                      label="Mật khẩu của bạn"
                      name="password"
                      id="typePassword"
                      type="text"
                      size="lg"
                      value={loginInput.password}
                      onChange={handleInput}
                    />
                    <span className="font-weight-bold text-danger">{loginInput.error_list.password}</span>
                  </div>

                </MDBCardBody>
                <MDBCardFooter className="d-flex align-items-center justify-content-center">
                  <MDBBtn color="info" disabled={btnclick === true}>
                    {btnclick === true ? (
                      <>
                        <span>
                          <i className="fas fa-circle-notch fa-spin" />
                          &nbsp;Đang tải{" "}
                        </span>
                      </>
                    ) : (
                      <>
                        <span> <i className="fab fa-500px" /> &nbsp; Đăng nhập{" "}</span>
                      </>
                    )}
                  </MDBBtn>
                </MDBCardFooter>
              </MDBCard>
            </form>
            <MDBCardText className="my-3 text-center">Hoặc đăng nhập bằng</MDBCardText>
            <MDBCard className=" shadow">
              <MDBCardHeader className="d-flex justify-content-center">
                <MDBBtn className='m-1 mx-3' style={{ backgroundColor: '#3b5998' }} href='#'>
                  <MDBIcon fab icon='facebook-f' />
                </MDBBtn>

                <MDBBtn className='m-1 mx-3' style={{ backgroundColor: '#333333' }} href='#'>
                  <MDBIcon fab icon='github' />
                </MDBBtn>

                <MDBBtn className='m-1 mx-3' style={{ backgroundColor: '#dd4b39' }} href='#'>
                  <MDBIcon fab icon='google' />
                </MDBBtn>
              </MDBCardHeader>
            </MDBCard>
          </div>
        </div>
      </div>
    </>
  );
}
export default Login;
