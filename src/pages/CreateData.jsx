import { useEffect, useState, useContext } from "react";
import { useGetUserID } from "../hooks/useGetUserID.jsx";
import { useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";
import axios from "axios";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import ListItemText from "@mui/material/ListItemText";
import Select from "@mui/material/Select";
import Checkbox from "@mui/material/Checkbox";
import Button from "@mui/material/Button";
import "./CreateData.modules.css";
import resortsHelperDataContext from "../contexts/resortsHelperDataContext.jsx";

const ITEM_HEIGHT = 100;
const ITEM_PADDING_TOP = 10;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

export default function CreateData() {
  const [cookies, _] = useCookies();
  const navigate = useNavigate();
  const userID = useGetUserID();
  const [resortName, setResortName] = useState([]);
  const helperFile = useContext(resortsHelperDataContext);

  const [mountain, setMountain] = useState({
    listName: "",
    mountains: [],
    userOwner: userID,
  });

  const getNamesOfResort = () => {
    if (helperFile !== null) {
      try {
        return helperFile.map((resort) => resort.label);
      } catch (error) {
        console.log(error);
      }
    }
  };

  const handleChange = (event) => {
    const {
      target: { value },
    } = event;
    setResortName(value);
  };

  const slugs = [];
  if (helperFile !== null) {
    try {
      helperFile.forEach((resort) => {
        resortName.forEach((selected) => {
          if (resort.label === selected) {
            slugs.push(resort.slug);
          }
        });
      });
    } catch (error) {
      console.log(error);
    }
  }

  const handleNameChange = (event) => {
    const { name, value } = event.target;
    setMountain({
      ...mountain,
      [name]: value.charAt(0).toUpperCase() + value.slice(1),
    });
  };

  useEffect(() => {
    setMountain({ ...mountain, mountains: slugs });
  }, [resortName]);

  const onSubmit = async (event) => {
    event.preventDefault();
    try {
      await axios.post(
        "https://open-peaks-v2-backend.onrender.com/mountain",
        mountain,
        {
          headers: { authorization: cookies.access_token },
        }
      );
      try {
        const response = await axios.get(
          "https://open-peaks-v2-backend.onrender.com/mountain"
        );
        const mountainID = response.data.pop()._id;
        try {
          const response = await axios.put(
            "https://open-peaks-v2-backend.onrender.com/mountain",
            {
              mountainID,
              userID,
            },
            { headers: { authorization: cookies.access_token } }
          );
        } catch (error) {
          console.error(error);
        }
      } catch (error) {
        console.log(error);
      }
      navigate("/");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="CreateData container create-data-container">
      <div className="container">
        <form onSubmit={onSubmit} className="create-form container">
          <h1>Create a list of resorts to track</h1>
          <input
            id="outlined-basic"
            label="List Name"
            // eslint-disable-next-line react/no-unknown-property
            variant="outlined"
            onChange={handleNameChange}
            name="listName"
            placeholder="Name of your list"
            required
          />
          <small>Create a unique list name</small>

          <div className="select-save">
            <FormControl
              sx={{ m: 1, width: 320 }}
              className="checklist-menu"
              size="small"
            >
              <InputLabel
                id="demo-multiple-checkbox-label"
                disableTypography
                className="input-label"
              >
                Resort Names
              </InputLabel>
              <Select
                labelId="demo-multiple-checkbox-label"
                id="demo-multiple-checkbox"
                multiple
                value={resortName}
                onChange={handleChange}
                input={<OutlinedInput label="Resort Names" />}
                renderValue={(selected) => selected.join(", ")}
                MenuProps={MenuProps}
                required
              >
                {getNamesOfResort()?.map((name) => (
                  <MenuItem key={name} value={name}>
                    <Checkbox checked={resortName.indexOf(name) > -1} />
                    <ListItemText
                      disableTypography
                      primary={name}
                      className="selections-list"
                    />
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <Button variant="outlined" type="submit" className="submit-button">
              Save List
            </Button>
          </div>
        </form>
        <div className="selected-list">
          <h1></h1>
          <article style={{ padding: ".7em" }}>
            <header style={{ marginBottom: ".6em" }}>
              <h3 style={{ marginBottom: "0" }}>You selected:</h3>
            </header>
            <body>
              {resortName.map((mt, index) => (
                <ul key={index}>
                  <li style={{ fontSize: "smaller" }}>{mt}</li>
                </ul>
              ))}
            </body>
          </article>
        </div>
      </div>
    </div>
  );
}
