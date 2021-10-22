import axios from "axios";
import {
  MDBBtn,
  MDBCard, MDBCardBody, MDBCardFooter, MDBCardHeader, MDBCardText, MDBCardTitle, MDBInput, MDBTypography
} from "mdb-react-ui-kit";
import React, { useState } from "react";
import { useCookies } from 'react-cookie';
import { useHistory } from "react-router";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import Navbar from "../../../layouts/frontend/Navbar";

export default function Register() {

  //cookie saves
  const [cookies, setCookie, removeCookie] = useCookies([]);
  //sử dụng lịch sử hook
  const history = useHistory();
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


  const [btnclick, setBtnClick] = useState(false); //định nghĩ event btn click
  const [registerInput, SetRegisterInput] = useState({
    name: "",
    email: "",
    password: "",
    password_confirmation: "",
    error_list: [],
  });
  const handleInput = (e) => {
    e.persist();
    SetRegisterInput({
      ...registerInput, //lấy ra tất cả các initState
      //set giá trị cho input dạng object
      // ví dụ : { name: "hoanghaiduong",email:"hhd1711@gmail.com",password:"123"  }
      [e.target.name]: e.target.value,
    });
  };

  const registerSubmit = (e) => {
    e.preventDefault();

    let timerInterval;
    Swal.fire({
      title: 'Đang xử lý !',
      html: 'Await <b></b> miliseconds.',
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
    }).then(() => { setBtnClick(true); })
    const data = {
      name: registerInput.name,
      email: registerInput.email,
      password: registerInput.password,
      password_confirmation: registerInput.password_confirmation,
    };
    axios.get("/sanctum/csrf-cookie").then(() => {
      axios({
        url: "api/register",
        method: "POST",
        data: data,
      })
        .then((res) => {
          setBtnClick(false);
          const result = res.data;
          console.log(res);

          if (result.status === 200) {
            Swal.fire({
              icon: "success",
              title: "Thành Công",
            }).then(() => {
              setCookie('auth_token', result.token);
              setCookie('auth_name', result.username);
              //{"redirect về "/"}
              history.push('/');
              SetRegisterInput({
                name: "",
                email: "",
                password: "",
                password_confirmation: "",
                error_list: [""],
              });
            });
            setBtnClick(false);
          } else {
            SetRegisterInput({
              ...registerInput,
              error_list: result.message, //error_list là key sau ":" là value
            });

            Swal.fire({
              icon: "error",
              title: "Thất Bại",
              confirmButtonText: "Thử lại",
              customClass: {
                confirmButton: "btn btn-info btn-sm",
              },
            });
          }
        })
        .catch((err) => {
          Toast.fire({
            icon: 'error',
            title: 'Thất bại !',
            text: err.message
          }).then(() => {
            setBtnClick(false);
            console.log(err.message);
          })

        });
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
    /* */
  };
  return (
    <>
      <>
        <Navbar />

      </>

      <div className="container py-5">

        <div className="row justify-content-center align-items-center">
          <div className="col-md-6 col-lg-5 col-sm-7 mx-auto col-12">
            <MDBCard className="shadow mb-4">
              <MDBCardBody className="my-0 py-3">
                <MDBCardTitle className="text-center mb-0">
                  ĐĂNG KÝ NGƯỜI DÙNG
                </MDBCardTitle>
              </MDBCardBody>
            </MDBCard>
            <form onSubmit={registerSubmit}>
              <MDBCard className="shadow mb-4">
                <MDBCardBody>
                  <div className="form-group mb-4">
                    <MDBInput
                      label="Tên đầy đủ"
                      name="name"
                      id="formControlLg"
                      type="text"
                      size="lg"
                      value={registerInput.name}
                      onChange={handleInput}
                    />

                    <MDBTypography note={registerInput.error_list.name} noteColor='danger' className="mt-3">
                      <span className="font-weight-bold">{registerInput.error_list.name}</span>
                    </MDBTypography>
                  </div>

                  <div className="form-group mb-4">
                    <MDBInput
                      label="Email của bạn"
                      name="email"
                      id="typeEmail"
                      type="email"
                      size="lg"
                      value={registerInput.email}
                      onChange={handleInput}
                    />
                    <MDBTypography note={registerInput.error_list.email} noteColor='danger' className="mt-3">
                      <span className="font-weight-bold"> {registerInput.error_list.email}</span>
                    </MDBTypography>

                  </div>
                  <div className="form-group mb-4">
                    <MDBInput
                      label="Mật khẩu của bạn"
                      name="password"
                      id="typePassword"
                      type="text"
                      size="lg"
                      value={registerInput.password}
                      onChange={handleInput}
                    />
                    <MDBTypography note={registerInput.error_list.password} noteColor='danger' className="mt-3">
                      <span className="font-weight-bold"> {registerInput.error_list.password}</span>
                    </MDBTypography>
                  </div>
                  <div className="form-group mb-4">
                    <MDBInput
                      label="Xác nhận mật khẩu"
                      name="password_confirmation"
                      id="formControlLg"
                      type="text"
                      size="lg"
                      value={registerInput.password_confirmation}
                      onChange={handleInput}
                    />
                    <MDBTypography note={registerInput.error_list.password_confirmation} noteColor='danger' className="mt-3">
                      <span className="font-weight-bold"> {registerInput.error_list.password_confirmation}</span>
                    </MDBTypography>
                  </div>
                </MDBCardBody>
                <MDBCardFooter className="d-flex align-items-center justify-content-center">
                  <MDBBtn outline disabled={btnclick === true}>
                    {btnclick === true ? (
                      <>
                        <span>
                          <i className="fas fa-circle-notch fa-spin" />
                          &nbsp;Đang tải{" "}
                        </span>
                      </>
                    ) : (
                      <>
                        <span> <i className="fab fa-500px" /> &nbsp; Đăng Ký{" "}</span>
                      </>
                    )}
                  </MDBBtn>
                </MDBCardFooter>
              </MDBCard>
              <MDBCard className="shadow">
                <MDBCardHeader>
                  <MDBCardText className="mb-0 d-sm-flex d-block justify-content-between align-items-center">Bạn đã có tài khoản ? <Link to="/login" className="btn btn-info d-block">Đăng Nhập</Link></MDBCardText>
                  <MDBCardText></MDBCardText>
                </MDBCardHeader>
              </MDBCard>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
