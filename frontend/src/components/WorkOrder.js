import React, { useEffect, useRef, useState } from "react";
import api from "../api";
import { Link, useNavigate } from "react-router-dom";
import Pagination from "./Pagination";
import { BsSearch, BsX } from "react-icons/bs";

const WorkOrder = (props) => {
  const [work_orders, setWorkOrders] = useState([]);
  const [allWorkOrders, setAllWorkOrders] = useState([]);
  const [users, setUsers] = useState([]);
  const [work_order, setWorkOrder] = useState([
    {
      id: "",
      title: "",
      description: "",
      property_id: "",
      status: "",
      technician_id: [],
    },
  ]);
  const navigate = useNavigate();

  const fetchWorkOrders = () => {
    api
      .get("/work_order/getWorkOrders")
      .then((res) => {
        if (res.data.success) {
          setWorkOrders(res.data.data);
          setAllWorkOrders(res.data.data);
          setUsers(res.data.users);
        }
      })
      .catch((err) => {
        console.error("API Error:", err);
      });
  };
  const [searchVal, setSearchVal] = useState("");
  const handleResetClick = () => {
    setSearchVal("");
    setWorkOrders(allWorkOrders);
  };
  function handleSearchClick() {
    if (searchVal === "") {
      setWorkOrders(allWorkOrders);
      return;
    }

    const lower = searchVal.toLowerCase();

    const filtered = allWorkOrders.filter((item) => {
      const techNames = item.technicians
        ? item.technicians
            .map((t) => t.name)
            .join(", ")
            .toLowerCase()
        : "";

      return (
        item.title?.toLowerCase().includes(lower) ||
        item.description?.toLowerCase().includes(lower) ||
        item.status_text?.toLowerCase().includes(lower) ||
        item.property?.address?.toLowerCase().includes(lower) ||
        item.user?.name?.toLowerCase().includes(lower) ||
        techNames.includes(lower)
      );
    });

    setWorkOrders(filtered);
  }
  const [currentPage, setCurrentPage] = useState(1);
  const [workOrderPerPage] = useState(5);
  const indexOfLastWorkOrder = currentPage * workOrderPerPage;
  const indexOfFirstWorkOrder = indexOfLastWorkOrder - workOrderPerPage;
  const currentWorkOrders = work_orders.slice(
    indexOfFirstWorkOrder,
    indexOfLastWorkOrder
  );
  useEffect(() => {
    if (localStorage.getItem("auth_token")) {
      fetchWorkOrders();
    } else {
      props.showAlert(
        "Please login to the site for access work_order management",
        "danger"
      );
      navigate("/login");
    }
  }, []);

  const ref = useRef(null);
  const refClose = useRef(null);
  const handleClick = (wo) => {
    ref.current.click();
    setWorkOrder({
      id: wo.id,
      title: wo.title,
      description: wo.description,
      property_id: wo.property_id,
      status: wo.status,
      technician_id: wo.technician_id.split(",").map(String),
    });
  };

  const handleStatusClick = (wo) => {
    ref.current.click();
    setWorkOrder({ id: wo.id, status: wo.status });
  };
  const handleChange = (e) => {
    setWorkOrder({ ...work_order, [e.target.name]: e.target.value });
  };

  const handleTechnicianChange = (e) => {
    const selectedValues = Array.from(e.target.selectedOptions, (option) =>
      option.value.toString()
    );
    setWorkOrder({ ...work_order, technician_id: selectedValues });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const { id, title, description, property_id, status, technician_id } =
      work_order;
    api
      .patch("/work_order/updateWorkOrder", {
        id: id,
        title: title,
        description: description,
        property_id: property_id,
        status: status,
        technician_id: technician_id,
      })
      .then((res) => {
        props.showAlert("Work Order updated successfully!", "success");
        if (res.data.success) {
          fetchWorkOrders();
        }
        refClose.current.click();
      })
      .catch((err) => {
        console.log(err);
        props.showAlert(err.response.data.custom_error, "danger");
        refClose.current.click();
        navigate("/work_order");
        console.error("API Error:", err);
      });
  };

  const handleStatusSubmit = (e) => {
    e.preventDefault();
    const { id, status } = work_order;
    api
      .patch("/work_order/updateWorkOrderStatus", {
        id: id,
        status: status,
      })
      .then((res) => {
        props.showAlert("Work Order status updated successfully!", "success");
        if (res.data.success) {
          fetchWorkOrders();
        }
        refClose.current.click();
      })
      .catch((err) => {
        console.log(err);
        props.showAlert(err.response.data.custom_error, "danger");
        refClose.current.click();
        navigate("/work_order");
        console.error("API Error:", err);
      });
  };

  const handleDelete = (id) => {
    api
      .delete("/work_order/deleteWorkOrder", {
        data: {
          id: id,
        },
      })
      .then((res) => {
        props.showAlert("work_order deleted successfully!", "success");
        if (res.data.success) {
          fetchWorkOrders();
        }
      })
      .catch((err) => {
        console.log(err);
        console.error("API Error:", err);
        props.showAlert(err.response.data.custom_error, "danger");
        navigate("/work_order");
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
            <form
              onSubmit={
                localStorage.getItem("isTech") === "true"
                  ? handleStatusSubmit
                  : handleSubmit
              }
            >
              <div className="modal-header">
                <h1 className="modal-title fs-5" id="exampleModalLabel">
                  Update Work order
                </h1>
                <button
                  type="button"
                  className="btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                ></button>
              </div>
              <div className="modal-body">
                <input type="hidden" name="id" value={work_order.id} />
                {localStorage.getItem("isTech") === "false" ? (
                  <>
                    <div className="mb-3">
                      <label htmlFor="title" className="form-label">
                        Title
                      </label>
                      <input
                        type="text"
                        name="title"
                        value={work_order.title}
                        className="form-control"
                        id="title"
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div className="mb-3">
                      <label htmlFor="description" className="form-label">
                        Description
                      </label>
                      <input
                        type="text"
                        name="description"
                        value={work_order.description}
                        className="form-control"
                        onChange={handleChange}
                        id="description"
                      />
                    </div>
                    <div className="mb-3">
                      <label htmlFor="property_id" className="form-label">
                        Address
                      </label>
                      <select
                        className="form-select"
                        value={work_order.property_id}
                        onChange={handleChange}
                        name="property_id"
                        aria-label="Default select example"
                        required
                      >
                        <option value="">Please select property</option>
                        {props.properties.map((p) => (
                          <option
                            key={p.id}
                            defaultValue={work_order.property_id}
                            value={p.id}
                          >
                            {p.address}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="mb-3">
                      <label htmlFor="technician_id" className="form-label">
                        Technician users
                      </label>
                      <select
                        className="form-select"
                        value={work_order.technician_id}
                        onChange={handleTechnicianChange}
                        name="technician_id"
                        aria-label="Default select example"
                        multiple
                      >
                        <option>Please select Technicians</option>
                        {users.map((u) => (
                          <option key={u.id} value={u.id}>
                            {u.name}
                          </option>
                        ))}
                      </select>
                    </div>{" "}
                  </>
                ) : (
                  ""
                )}
                <div className="mb-3">
                  <label htmlFor="status" className="form-label">
                    Status
                  </label>
                  <select
                    className="form-select"
                    value={work_order.status}
                    onChange={handleChange}
                    name="status"
                    aria-label="Default select example"
                    required
                  >
                    <option value="">Please select status</option>
                    <option key="pending" value="pending">
                      Pending
                    </option>
                    <option key="in_progress" value="in_progress">
                      In Progress
                    </option>
                    <option key="completed" value="completed">
                      Completed
                    </option>
                  </select>
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
          <h2>Work Order List</h2>
          {localStorage.getItem("isTech") === "false" && (
            <Link
              to="/add_work_order"
              state={{ users }}
              className="btn btn-primary"
              style={{ marginLeft: "auto" }}
            >
              Add Work order
            </Link>
          )}
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
              <th scope="col">Work order title</th>
              <th scope="col">Description</th>
              <th scope="col">Address</th>
              <th scope="col">Technician Users</th>
              <th scope="col">Status</th>
              <th scope="col">Created By</th>
              <th scope="col">Action</th>
            </tr>
          </thead>
          <tbody>
            {currentWorkOrders.map((p, index) => (
              <tr key={p.id}>
                <th scope="row">{indexOfFirstWorkOrder + index + 1}</th>
                <td>{p.title}</td>
                <td>{p.description}</td>
                <td>{p.property.address}</td>
                <td>
                  {p.technicians && p.technicians.length > 0
                    ? p.technicians.map((t) => t.name).join(", ")
                    : "-"}
                </td>
                <td>{p.status_text}</td>
                <td>{p.user.name}</td>
                <td>
                  {localStorage.getItem("isTech") === "true" ? (
                    <div>
                      <i
                        className="fa-solid fa-pen-to-square"
                        onClick={() => {
                          handleStatusClick(p);
                        }}
                      ></i>
                    </div>
                  ) : (
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
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <Pagination
          dataPerPage={workOrderPerPage}
          totalData={work_orders.length}
          setCurrentPage={setCurrentPage}
          currentPage={currentPage}
        />
      </div>
    </>
  );
};

export default WorkOrder;
