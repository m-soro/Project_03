/* eslint-disable jsx-a11y/no-redundant-roles */
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState, useContext } from "react";
import resortsHelperDataContext from "../contexts/resortsHelperDataContext";

import axios from "axios";
import "./Edit.modules.css";

export default function Edit() {
  const { state } = useLocation();
  const listId = state?.mountainList._id;
  const [listToEdit, setListToEdit] = useState();
  const [listName, setListName] = useState();
  const navigate = useNavigate();
  const helperFile = useContext(resortsHelperDataContext);

  const handleEdit = async (id) => {
    try {
      const response = await axios.get(
        `https://open-peaks-v2-backend.onrender.com/mountain/update/${id}`
      );
      return response.data;
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    handleEdit(listId).then((res) => {
      setListToEdit(res);
    });
  }, []);

  const handleListNameChange = (event) => {
    const { listName, value } = event.target;
    setListName(value);
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    try {
      await axios.put(
        `https://open-peaks-v2-backend.onrender.com/mountain/update/${listToEdit.message?._id}`,
        {
          listName: listName,
        }
      );
      navigate("/");
    } catch (error) {
      console.error(error);
    }
  };

  const myDetailedLists = helperFile.filter((r) =>
    listToEdit?.message?.mountains?.includes(r.slug)
  );

  const populateList = () => {
    return myDetailedLists.map((listItem, index) => {
      return <li key={index}>{listItem.label}</li>;
    });
  };
  return (
    <div className="Edit container">
      <h2>Rename your list</h2>

      {listToEdit !== undefined ? (
        <>
          <article className="edit-form-article">
            <form onSubmit={onSubmit} className="edit-form">
              <div className="text-input">
                List Name:{" "}
                <input
                  type="text"
                  name="listName"
                  onChange={handleListNameChange}
                  defaultValue={listToEdit.message?.listName}
                  required
                />
                <small>*editing specific list items is not allowed*</small>
              </div>
              <br />

              <button
                type="submit"
                role="button"
                className="outline edit-submit-button"
              >
                submit
              </button>
            </form>
          </article>

          {myDetailedLists !== null && myDetailedLists !== undefined ? (
            <article className="included-resorts-article">
              <ul className="included-resorts">
                <p>This list includes:</p>
                {populateList()}
              </ul>
            </article>
          ) : (
            <div>This list is empty.</div>
          )}
        </>
      ) : (
        <div></div>
      )}
    </div>
  );
}
