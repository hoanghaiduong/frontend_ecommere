import React from "react";

import { Link } from "react-router-dom";
import {
  MDBDropdown,
  MDBDropdownMenu,
  MDBDropdownToggle,
  MDBDropdownItem,
  MDBDropdownLink,
  MDBDropdownDivider,
} from "mdb-react-ui-kit";
const Navbar = () => {
  return (
    <nav className="sb-topnav navbar navbar-expand container-fluid">
      {/* Navbar Brand*/}
      <Link className="navbar-brand ps-3" to="/admin">
        Start Bootstrap
      </Link>
      {/* Sidebar Toggle*/}
      <button
        className="btn btn-primary btn-sm order-1 order-lg-0 me-4 me-lg-0"
        id="sidebarToggle"
        to="#!"
      >
        <i className="fas fa-bars" />
      </button>
      {/* Navbar Search*/}
      <form className="d-none d-md-inline-block form-inline ms-auto me-0 me-md-3 my-2 my-md-0">
        <div className="input-group">
          <input
            className="form-control"
            type="text"
            placeholder="Search for..."
            aria-label="Search for..."
            aria-describedby="btnNavbarSearch"
          />
          <button
            className="btn btn-primary"
            id="btnNavbarSearch"
            type="button"
          >
            <i className="fas fa-search" />
          </button>
        </div>
      </form>
      {/* Navbar*/}
      <MDBDropdown>
        <MDBDropdownToggle color="light" className="mx-2">
          <i className="fas fa-user" />
          &nbsp;
        </MDBDropdownToggle>
        <MDBDropdownMenu>
          <MDBDropdownItem>
            <MDBDropdownLink href="#">Action</MDBDropdownLink>
          </MDBDropdownItem>
          <MDBDropdownItem>
            <MDBDropdownLink href="#">Another action</MDBDropdownLink>
          </MDBDropdownItem>
          <MDBDropdownDivider></MDBDropdownDivider>
          <MDBDropdownItem>
            <MDBDropdownLink href="#">Something else here</MDBDropdownLink>
           
          </MDBDropdownItem>
        </MDBDropdownMenu>
      </MDBDropdown>
    </nav>
  );
};
export default Navbar;
