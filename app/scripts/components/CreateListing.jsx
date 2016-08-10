import React from 'react';
import { connect } from 'react-redux';
import itemActions from '../actions/itemActions.js';

const CreateListing = ({ dispatchCreateNewListing, dispatchSaveUpload, id, data_uri, filetype, filename }) => {
  let title;
  let zip;
  let image;
  let category;
  let description;
  let condition;

  const handleChange = (e) => {
    const reader = new FileReader();
    const file = e.target.files[0];

    reader.onload = (upload) => {
      dispatchSaveUpload(upload.target.result, file.name, file.type);
    };

    reader.readAsDataURL(file);
  };

  return (
    <div>
      <div className="main_container">
        <h1>Create a Listing</h1>
        <form encType="multipart/form-data"
          onSubmit={(e) => {
            e.preventDefault();
            console.log(dispatchCreateNewListing);
            const data = {
              title: title.value,
              zipcode: zip.value,
              status:1,
              image: image.value,
              category: category.value,
              description: description.value,
              condition: condition.value,
              giverId: id,
              status: true,
            };
            // console.log(data);
            dispatchCreateNewListing(data);
            title.value = '';
            zip.value = '';
            image.value = '';
            category.value = 'all-categories';
            description.value = '';
            condition.value = '5';
          }}
        >
          <label htmlFor="title">Title</label>
          <input ref={(node) => { title = node; }} id="title" required />
          <label htmlFor="zip" >Zip Code</label>
          <input ref={(node) => { zip = node; }} id="zip" required />
          <label htmlFor="category">Categories</label>
          <br />
          <select ref={(node) => { category = node; }} id="category" required>
            <option value="all-categories">All Categories</option>
            <option value="appliances">Appliances</option>
            <option value="fashion">Clothing, Shoes &amp; Jewelry</option>
            <option value="furniture">Furniture</option>
            <option value="books">Books</option>
            <option value="electronics">Electronics</option>
            <option value="tools">Tools &amp; Home Improvement</option>
          </select>
          <br />
          <label htmlFor="condition" >Condition</label><br />
          <select ref={(node) => { condition = node; }} id="condition" required>
            <option value="5">New</option>
            <option value="4">Excellent</option>
            <option value="3">Good</option>
            <option value="2">Fair</option>
            <option value="1">Salvage</option>
          </select><br />
          <label htmlFor="image">Image</label><br />
          <input ref={(node) => { image = node; }} name="photo" type="file" accept="image/*" onChange={handleChange}/>
          <label htmlFor="description">Description</label>
          <textarea ref={(node) => { description = node; }} id="description" required />
          <button type="submit">add</button>
        </form>
      </div>
    </div>
  );
};

CreateListing.propTypes = {
  dispatchCreateNewListing: React.PropTypes.func,
};

const mapStateToProps = (state) => {
  return {
    data_uri: state.upload.data_uri,
    filename: state.upload.filename,
    filetype: state.upload.filetype,
    id: state.users.id,
  };
};

const mapDispatchToProps = (dispatch) => (
  {
    dispatchCreateNewListing: (data) => {
      dispatch(itemActions.postNewListing(data));
    },
    dispatchSaveUpload: (upload, filename, filetype) => {
      dispatch(saveUpload(upload, filename, filetype));
    },
  }
);

export default connect(mapStateToProps, mapDispatchToProps)(CreateListing);
