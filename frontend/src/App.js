import React, { useEffect, useState } from "react";
import "./App.css";

function Cars() {
  const carFormInitialData = {
    id: "",
    brand: "",
    name: "",
    releaseYear: "",
    color: "",
  };
  const [carFormData, setCarFormData] = useState(carFormInitialData);
  const [cars, setCars] = useState([]);
  // state to trigger refresh table everytime any changes occurs to table
  const [refresh, setRefresh] = useState(false);
  const [updateStatus, setUpdateStatus] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCarFormData({
      ...carFormData,
      [name]: value,
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const response = await fetch("http://127.0.0.1:8081/save", {
      method: "POST",
      body: JSON.stringify(carFormData),
      headers: { "Content-Type": "application/json" },
    });

    // Rerender the table data based upon the status code
    const responseJson = await response.json();
    if (responseJson.status === 200) {
      setRefresh(!refresh);
      setCarFormData(carFormInitialData);
    }
  };

  const handleDelete = async (carId) => {
    const response = await fetch("http://localhost:8081/delete", {
      method: "DELETE",
      body: JSON.stringify({
        id: carId,
      }),
      headers: { "Content-Type": "application/json" },
    });

    // Rerender the table data based upon the status code
    const responseJson = await response.json();
    if (responseJson.status === 200) {
      setRefresh(!refresh);
    }
  };

  const handleEdit = async (carId) => {
    const response = await fetch("http://localhost:8081/edit", {
      method: "PUT",
      body: JSON.stringify({
        id: carId,
      }),
      headers: { "Content-Type": "application/json" },
    });

    // Rerender the table data based upon the status code
    const responseJson = await response.json();
    if (responseJson.status === 200) {
      setUpdateStatus(true);
      setCarFormData(responseJson.response[0]);
    } else {
      setUpdateStatus(false);
      setCarFormData(carFormInitialData);
    }
  };

  useEffect(() => {
    const fetchApi = async () => {
      const response = await fetch("http://127.0.0.1:8081/cars-data");
      const data = await response.json();
      setCars(data);
    };

    fetchApi();
  }, [refresh]);

  return (
    <div className="cars-from-wrapper">
      <form id="cars-form" onSubmit={handleSubmit} autoComplete="off">
        {/* FORM INPUT DATAS */}
        <label>
          ID:
          <input
            name="id"
            type="text"
            value={carFormData.id}
            onChange={handleInputChange}
            required
          />
        </label>
        <label>
          Brand:
          <input
            name="brand"
            type="text"
            value={carFormData.brand}
            onChange={handleInputChange}
            required
          />
        </label>
        <label>
          Name:
          <input
            name="name"
            type="text"
            value={carFormData.name}
            onChange={handleInputChange}
            required
          />
        </label>
        <label>
          Release Year:
          <input
            name="releaseYear"
            type="text"
            value={carFormData.releaseYear}
            onChange={handleInputChange}
            required
          />
        </label>
        <label>
          Color:
          <input
            name="color"
            type="text"
            value={carFormData.color}
            onChange={handleInputChange}
            required
          />
        </label>
        <input type="submit" value={`${updateStatus ? "Update" : "Submit"}`} />
      </form>
      {/**
       * TODO: Update the code below to see any new proprties added to carFormData
       * */}
      <p>
        ID: {carFormData.id} &nbsp; Brand: {carFormData.brand} &nbsp; Name:{" "}
        {carFormData.name}
        &nbsp; Release Year: {carFormData.releaseYear} &nbsp; Color:{" "}
        {carFormData.color}
      </p>

      <h2>Cars Data</h2>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Brand</th>
            <th>Name</th>
            <th>Released Year</th>
            <th>Color</th>
            <th>Edit</th>
            <th>Delete</th>
          </tr>
        </thead>
        <tbody>
          {cars.map((carData) => {
            const { id, brand, name, releaseYear, color } = carData;
            return (
              <tr key={id + 1}>
                <td>{id}</td>
                <td>{brand}</td>
                <td>{name}</td>
                <td>{releaseYear}</td>
                <td>{color}</td>
                <td className="btn" onClick={() => handleEdit(carData.id)}>
                  ✎
                </td>
                <td className="btn" onClick={() => handleDelete(carData.id)}>
                  🗑
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default Cars;