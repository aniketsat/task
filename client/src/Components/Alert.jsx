/* eslint-disable react/prop-types */
const Alert = ({ message, type }) => {
  return (
    <>
      <div
        className={`alert alert-${type} mb-0 alert-dismissible alert-absolute fade show`}
        id="alertExample"
        role="alert"
        data-mdb-color="secondary"
        style={{
          position: "absolute",
          bottom: "10px",
          right: "10px",
          zIndex: "1",
        }}
      >
        {message}
        <button
          type="button"
          className="btn-close ms-2"
          data-mdb-dismiss="alert"
          aria-label="Close"
        ></button>
      </div>
    </>
  );
};

export default Alert;
