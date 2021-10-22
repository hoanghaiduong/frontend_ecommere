import axios from "axios";
import {
  MDBBtn, MDBCollapse, MDBContainer, MDBDropdown, MDBDropdownItem,
  MDBDropdownLink, MDBDropdownMenu, MDBDropdownToggle, MDBIcon, MDBNavbar, MDBNavbarItem,
  MDBNavbarLink, MDBNavbarNav, MDBNavbarToggler
} from "mdb-react-ui-kit";
import React, { useState } from "react";
import { useHistory } from "react-router";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";

function Navbar() {
  const [showNavRight, setShowNavRight] = useState(false);
  const history = useHistory();
  function getCookie(cname) {
    let name = cname + "=";
    let decodedCookie = decodeURIComponent(document.cookie);
    let ca = decodedCookie.split(';');
    for (let i = 0; i < ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) == ' ') {
        c = c.substring(1);
      }
      if (c.indexOf(name) == 0) {
        return c.substring(name.length, c.length);
      }
    }
    return "";
  }
  const token_cookie = getCookie('auth_token');


  const deleteAllCookies = () => {
    var cookies = document.cookie.split(";");

    for (var i = 0; i < cookies.length; i++) {
      var cookie = cookies[i];
      var eqPos = cookie.indexOf("=");
      var name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
      document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT";
    }
  }


  const logoutSubmit = (e) => {
    e.preventDefault();
    const questionSWAL = Swal.mixin({
      customClass: {
        confirmButton: 'btn btn-success btn-rounded ms-2',
        cancelButton: 'btn btn-danger btn-rounded me-2'
      },
      buttonsStyling: false
    })
    questionSWAL.fire({
      title: 'Bạn có muốn đăng xuất ?',
      icon: "question",
      showCancelButton: true,
      confirmButtonText: 'Có, Đăng Xuất!',
      cancelButtonText: 'Không, Tôi muốn ở lại!',
      reverseButtons: true,
      showLoaderOnConfirm: true,
    }).then((response) => {
      if (response.isConfirmed) {
        let timerInterval;
        questionSWAL.fire({
          title: 'Vui lòng chờ',
          html: 'Khoảng <b></b> milliseconds.',
          timer: 1000,
          timerProgressBar: true,
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
        }).then(() => {
          axios.get("/sanctum/csrf-cookie").then(() => {
            axios.post('api/logout')
              .then((res) => {
                const result = res.data;
                questionSWAL.fire({
                  icon: 'success',
                  title: result.message
                }).then(() => {
                  deleteAllCookies();
                  history.push("/");
                })
              })
              .catch((err) => {
                questionSWAL.fire({ icon: 'error', 'title': err.message });
              })
          })
        })

      } else if (
        response.dismiss === Swal.DismissReason.cancel
      ) {
        //nếu ấn huỷ
      }
    })


  }
  var AuthButtons = "";
  if (!getCookie('auth_token')) {
    AuthButtons = (

      <MDBDropdownItem>
        <MDBDropdownLink className="bg-white">
          <Link
            to="/login"
            className="btn btn-sm btn-info d-block"
          >
            Đăng Nhập
          </Link>
        </MDBDropdownLink>

        <MDBDropdownLink className="bg-white">
          <Link
            to="/register"
            className="btn btn-sm btn-primary d-block"
          >
            Đăng Ký
          </Link>
        </MDBDropdownLink>
      </MDBDropdownItem>

    )
  }
  else {
    AuthButtons = (
      <MDBDropdownItem>
        <MDBDropdownLink className="bg-white d-block py-2">
          <MDBBtn onClick={logoutSubmit} size="sm" color="light" className="w-100">
            <> Đăng xuất</>
          </MDBBtn>
        </MDBDropdownLink>
      </MDBDropdownItem>
    )
  }
  return (
    <>
      <MDBNavbar expand="lg" light bgColor="light" sticky>
        <MDBContainer>
          <MDBBtn color="default" >
            <Link to="/">Thương Mại Điện Tử</Link>
          </MDBBtn>

          <MDBNavbarToggler
            aria-controls="navbarSupportedContent"
            aria-expanded="false"
            aria-label="Toggle navigation"
            onClick={() => setShowNavRight(!showNavRight)}
          >
            <MDBIcon icon="bars" fas />
          </MDBNavbarToggler>

          <MDBCollapse navbar show={showNavRight}>
            <MDBNavbarNav right fullWidth={false} className="mb-2 mb-lg-0">
              <MDBNavbarItem>
                <MDBNavbarLink className="btn p-2 px-3 m-2" >
                  <Link to="/">Home</Link>
                </MDBNavbarLink>
              </MDBNavbarItem>
              <MDBNavbarItem>
                <MDBNavbarLink className="btn p-2 px-3 m-2" >
                  <Link aria-current="page" to="#">
                    Link
                  </Link>
                </MDBNavbarLink>
              </MDBNavbarItem>

              <MDBNavbarItem>
                <MDBDropdown>
                  <MDBDropdownToggle tag="a" className="btn p-2 px-3 m-2">
                    <Link to="#">Tài Khoản</Link>
                  </MDBDropdownToggle>
                  <MDBDropdownMenu>
                    {AuthButtons}
                  </MDBDropdownMenu>
                </MDBDropdown>

              </MDBNavbarItem>
            </MDBNavbarNav>
            {/* Tìm kiếm */}
            {/*   <form className="d-flex align-items-center input-group w-auto m-2">
              <input
                type="search"
                className="form-control"
                placeholder="Tìm kiếm"
                aria-label="Search"
              />
              <MDBBtn color="primary">
                Search
              </MDBBtn>
            </form> */}
          </MDBCollapse>
        </MDBContainer>
      </MDBNavbar>
    </>
  );
}
export default Navbar;
