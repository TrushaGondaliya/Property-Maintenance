import React, { useEffect, useRef, useState } from "react";
import api from "../api";
import { Link, useNavigate } from "react-router-dom";
import Pagination from "./Pagination";
import { BsSearch, BsX } from "react-icons/bs";

function PropertyList(props) {
  const [property, setProperty] = useState([
    { id: "", name: "", description: "", address: "" },
  ]);
  const navigate = useNavigate();

  useEffect(() => {
    if (!localStorage.getItem("auth_token")) {
      props.showAlert(
        "Please login to the site for access property management",
        "danger"
      );
      navigate("/login");
    }
  }, []);

  const [searchVal, setSearchVal] = useState("");
  const handleResetClick = () => {
    setSearchVal("");
    props.setProperties(props.allProperties);
  };
  function handleSearchClick() {
    if (searchVal.trim() === "") {
      props.setProperties(props.allProperties);
      return;
    }

    const lower = searchVal.trim().toLowerCase();

    const filtered = props.allProperties.filter((item) => {
      return (
        item.name?.toLowerCase().includes(lower) ||
        item.description?.toLowerCase().includes(lower) ||
        item.address?.toLowerCase().includes(lower) ||
        item.user_name?.toLowerCase().includes(lower)
      );
    });

    props.setProperties(filtered);
  }

  const [currentPage, setCurrentPage] = useState(1);
  const [propertyPerPage] = useState(5);
  const indexOfLastProperty = currentPage * propertyPerPage;
  const indexOfFirstProperty = indexOfLastProperty - propertyPerPage;
  const currentProperties = props.properties.slice(
    indexOfFirstProperty,
    indexOfLastProperty
  );

  const ref = useRef(null);
  const refClose = useRef(null);
  const handleClick = (p) => {
    ref.current.click();
    setProperty({
      id: p.id,
      name: p.name,
      description: p.description,
      address: p.address,
    });
  };
  const handleChange = (e) => {
    setProperty({ ...property, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const { id, name, description, address } = property;
    api
      .patch("/property/update", {
        id: id,
        name: name,
        description: description,
        address: address,
      })
      .then((res) => {
        props.showAlert("Property updated successfully!", "success");
        if (res.data.success) {
          props.setProperties(res.data.data);
        }
        refClose.current.click();
      })
      .catch((err) => {
        console.log(err);
        props.showAlert(err.response.data.custom_error, "danger");
        refClose.current.click();
        navigate("/");
        console.error("API Error:", err);
      });
  };

  const handleDelete = (id) => {
    api
      .delete("/property/delete", {
        data: {
          id: id,
        },
      })
      .then((res) => {
        props.showAlert("Property deleted successfully!", "success");
        if (res.data.success) {
          props.setProperties(res.data.data);
        }
      })
      .catch((err) => {
        console.log(err);
        console.error("API Error:", err);
        props.showAlert(err.response.data.custom_error, "danger");
        navigate("/");
      });
  };

  return (
    <>
      <button
        type="button"
        className="btn btn-primary d-none"
        data-bs-toggle="modal"
        data-bs-target="#exampleModal"
        ref={ref}
      ></button>
      <div
        className="modal fade"
        id="exampleModal"
        tabIndex="-1"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <form onSubmit={handleSubmit}>
              <div className="modal-header">
                <h1 className="modal-title fs-5" id="exampleModalLabel">
                  Update Property
                </h1>
                <button
                  type="button"
                  className="btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                ></button>
              </div>
              <div className="modal-body">
                <input type="hidden" name="id" value={property.id} />
                <div className="mb-3">
                  <label htmlFor="name" className="form-label">
                    Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    className="form-control"
                    value={property.name}
                    id="name"
                    onChange={handleChange}
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="description" className="form-label">
                    Description
                  </label>
                  <input
                    type="text"
                    name="description"
                    value={property.description}
                    className="form-control"
                    onChange={handleChange}
                    id="description"
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="address" className="form-label">
                    Address
                  </label>
                  <input
                    type="text"
                    id="address"
                    name="address"
                    value={property.address}
                    className="form-control"
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button
                  ref={refClose}
                  type="button"
                  className="btn btn-secondary"
                  data-bs-dismiss="modal"
                >
                  Close
                </button>
                <button type="submit" className="btn btn-primary">
                  Save changes
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
      <div className="container mt-2">
        <div
          className="d-flex align-items-center justify-content-between mb-2"
          style={{ gap: "15px" }}
        >
          <h2>Property List</h2>
          <Link
            to="/add_property"
            className="btn btn-primary"
            style={{ marginLeft: "auto" }}
          >
            Add Property
          </Link>
          <div className="input-group" style={{ width: "250px" }}>
            <input
              type="text"
              className="form-control"
              aria-label="Text input with dropdown button"
              value={searchVal}
              onChange={(e) => setSearchVal(e.target.value)}
            />
            <button
              className="btn btn-outline-secondary"
              type="button"
              id="inputGroupFileAddon04"
              onClick={handleSearchClick}
            >
              <BsSearch />
            </button>
            <button
              className="btn btn-outline-secondary"
              type="button"
              onClick={handleResetClick}
            >
              <BsX />
            </button>
          </div>
        </div>
        <table className="table table-bordered">
          <thead className="table-light">
            <tr>
              <th scope="col">#</th>
              <th scope="col">Name</th>
              <th scope="col">Description</th>
              <th scope="col">Address</th>
              <th scope="col">Created By</th>
              <th scope="col">Action</th>
            </tr>
          </thead>
          <tbody>
            {currentProperties.map((p, index) => (
              <tr key={p.id}>
                <th scope="row">{indexOfFirstProperty + index + 1}</th>
                <td>{p.name}</td>
                <td>{p.description}</td>
                <td>{p.address}</td>
                <td>{p.user_name}</td>
                <td>
                  <div>
                    <i
                      className="fa-solid fa-pen-to-square"
                      onClick={() => {
                        handleClick(p);
                      }}
                    ></i>
                    <i
                      className="fa-regular fa-trash-can"
                      onClick={() => {
                        handleDelete(p.id);
                      }}
                    ></i>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <Pagination
          dataPerPage={propertyPerPage}
          totalData={props.properties.length}
          setCurrentPage={setCurrentPage}
          currentPage={currentPage}
        />
      </div>
    </>
  );
}

export default PropertyList;
