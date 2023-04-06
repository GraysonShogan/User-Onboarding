import React, { useState, useEffect } from "react";
import * as yup from "yup";
import axios from "axios";

const schema = yup.object().shape({
  firstname: yup
    .string()
    .required("First name is required")
    .min(6, "User needs to be 6 chars min!"),
  lastname: yup.string().required("Last name is required"),
  email: yup.string().required("Email is required"),
  password: yup.string().required("Password is required"),
  terms: yup.string(),
});

export default function Form() {
  const [users, setUsers] = useState([]);

  const [form, setForm] = useState({
    firstname: "",
    lastname: "",
    email: "",
    password: "",
    terms: false,
  });

  const [errors, setErrors] = useState({
    firstname: "",
    lastname: "",
    email: "",
    password: "",
    terms: "",
  });

  const [disabled, setDisabled] = useState(true);

  const setFormErrors = (name, value) => {
    yup
      .reach(schema, name)
      .validate(value)
      .then(() => setErrors([...errors, { [name]: "" }]))
      .catch((err) => setErrors({ ...errors, [name]: err.errors[0] }));
  };

  const handleChange = (event) => {
    const { name, type, value, checked } = event.target;
    const updatedInfo = type === "checkbox" ? checked : value;
    setFormErrors(name, updatedInfo);
    setForm({
      ...form,
      [name]: updatedInfo,
    });
  };

  const submit = (event) => {
    event.preventDefault();
    const newUser = {
      firstname: form.firstname,
      lastname: form.lastname,
      email: form.email,
      password: form.password,
      terms: form.terms,
    };
    axios.post("https://reqres.in/api/users", newUser).then((res) => {
      setUsers([...users, res.data]);
      setForm({
        firstname: "",
        lastname: "",
        email: "",
        password: "",
        terms: "",
      });
    });
  };

  useEffect(() => {
    schema.isValid(form).then((valid) => setDisabled(!valid));
  }, [form]);

  return (
    <div>
      <div style={{ color: "red" }}>
        <div>{errors.firstname}</div>
        <div>{errors.lastname}</div>
        <div>{errors.email}</div>
        <div>{errors.password}</div>
      </div>
      <form onSubmit={submit}>
        <label htmlFor="firstname">
          First Name
          <input
            onChange={handleChange}
            value={form.firstname}
            name="firstname"
            id="firstname"
            type="text"
          />
        </label>
        <label htmlFor="lastname">
          Last Name
          <input
            onChange={handleChange}
            value={form.lastname}
            name="lastname"
            id="lastname"
            type="text"
          />
        </label>
        <label>
          Email
          <input
            onChange={handleChange}
            value={form.email}
            name="email"
            id="email"
            type="email"
          />
        </label>
        <label htmlFor="password">
          Password
          <input
            onChange={handleChange}
            value={form.password}
            name="password"
            id="password"
            type="password"
          />
        </label>
        <label htmlFor="terms">
          Terms of Service
          <input
            onChange={handleChange}
            checked={form.terms}
            name="terms"
            id="terms"
            type="checkbox"
          />
        </label>
        <button disabled={disabled}>Submit!</button>
      </form>
      <div className="users">
        <h2>Users</h2>
        <pre>
          {users.map((user) => (
            <div key={user.id}>{JSON.stringify(Object.values(user))}</div>
          ))}
        </pre>
      </div>
    </div>
  );
}
