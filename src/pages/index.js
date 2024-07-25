import { useEffect, useState, useRef } from "react";
import { CiTrash, CiEdit, CiClipboard } from "react-icons/ci";
import Head from "next/head";
import styles from "@/styles/Home.module.scss";

export default function Home() {
  const nameRef = useRef();
  const URLRef = useRef();
  const [qrs, setQrs] = useState([]);
  const [currentEditId, setCurrentEditId] = useState(null);
  const [currentDeleteId, setCurrentDeleteId] = useState(null);
  const [created, setCreated] = useState(false);
  const [deleted, setDeleted] = useState(false);
  const [deletedError, setDeletedError] = useState(false);
  const [updated, setUpdated] = useState(false);
  const [updatedError, setUpdatedError] = useState(false);

  async function addQr() {
    const name = nameRef.current.value.trim();
    const URL = URLRef.current.value.trim();
    if (name.length < 3 || URL.length < 3) return;
    const postData = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name,
        URL,
      }),
    };
    const res = await fetch(`/api/qr`, postData);
    const response = await res.json();
    if (response.response.message !== "success") return;
    const newQr = response.response.qr;
    setQrs((prevQrs) => [
      ...prevQrs,
      {
        _id: newQr._id,
        name: newQr.name,
        URL: newQr.URL,
      },
    ]);
    setCreated(true);
    nameRef.current.value = "";
    URLRef.current.value = "";
  }

  async function getQrs() {
    const postData = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    };
    const res = await fetch(`/api/qr`, postData);
    const response = await res.json();
    setQrs(response.qrs);
  }

  async function deleteQr(id) {
    const postData = {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        _id: id,
      }),
    };
    const res = await fetch(`/api/qr`, postData);
    const response = await res.json();
    if (response.response.message === "error") return setDeletedError(true);
    setQrs((prevQrs) => prevQrs.filter((a) => a._id !== id));
    setDeleted(true);
    setCurrentDeleteId(null);
  }

  async function updateQr() {
    const name = nameRef.current.value.trim();
    const URL = URLRef.current.value.trim();
    if (!currentEditId || name.length < 3 || URL.length < 3) return;
    const postData = {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        _id: currentEditId,
        name,
        URL,
      }),
    };
    const res = await fetch(`/api/qr`, postData);
    const response = await res.json();
    if (response.response.message === "error") return setUpdatedError(true);
    const qrIdUpdated = response.response.qr._id;
    const qrUpdatedName = response.response.qr.name;
    const qrUpdatedURL = response.response.qr.URL;
    const qrsStateAfterUpdate = qrs.map((qr) =>
      qr._id === qrIdUpdated ? { ...qr, name: qrUpdatedName, URL: qrUpdatedURL } : qr
    );
    setUpdated(true);
    setQrs(qrsStateAfterUpdate);
    setCurrentEditId(null);
    nameRef.current.value = "";
    URLRef.current.value = "";
  }

  useEffect(() => {
    getQrs();
  }, []);
  
  const handleCopy = (url) => {
    navigator.clipboard.writeText(url).then(() => {
      alert('URL copied to clipboard');
    });
  };

  return (
    <>
      <Head>
        <h1>QR Redirect App</h1>
      </Head>
      <div className={styles.container}>
        <section className={styles.create}>
          <h2>Create</h2>
          <div className={styles.input}>
            <div className={styles.label}>Name</div>
            <input type="text" ref={nameRef} placeholder="Enter name" />
          </div>
          <div className={styles.input}>
            <div className={styles.label}>URL</div>
            <input type="text" ref={URLRef} placeholder="Enter URL" />
          </div>
          {created ? <div className={styles.success}>Success!</div> : null}
          <div className={styles.buttonarea}>
            <input className={styles.button} value="Save" type="button" onClick={addQr} />
          </div>
        </section>

        <section className={styles.read}>
          <h2>List</h2>
          <div className={styles.qrs}>
            {qrs.map((item) => (
              <div key={item._id} className={styles.qr}>
                <div className={styles.qrContainer}>
                  <div className={styles.qrBit}><span>id</span> {`https://qr-redirect-app-3d71bbb92e78.herokuapp.com/redirect?id=${item._id}`} </div>
                  <div className={styles.qrBit}><span>name</span> {item.name} </div>
                  <div className={styles.qrBit}><span>URL</span> {item.URL}{" "}</div>
                  <div className={styles.qrContainer}>
                  <CiEdit className={`${styles.icons} ${styles.editIcon}`} onClick={() => setCurrentEditId(item._id)} />
                  <CiTrash
                    className={`${styles.icons} ${styles.trashIcon}`}
                    onClick={() => setCurrentDeleteId(item._id)}
                  />
                  </div>
                </div>
                {currentEditId === item._id && (
                  <div className={styles.update}>
                    <h2>Update</h2>
                    <div className={styles.input}>
                      <div className={styles.label}>Name</div>
                      <input type="text" defaultValue={item.name} ref={nameRef} placeholder="Enter name" />
                    </div>
                    <div className={styles.input}>
                      <div className={styles.label}>URL</div>
                      <input type="text" defaultValue={item.URL} ref={URLRef} placeholder="Enter URL" />
                    </div>
                    {updated ? <div className={styles.success}>Success!</div> : null}
                    {updatedError ? <div className={styles.error}>Error!</div> : null}
                    <div className={styles.buttonarea}>
                      <input className={styles.button} value="Update" type="button" onClick={updateQr} />
                      <input
                        className={styles.button}
                        value="Cancel"
                        type="button"
                        onClick={() => setCurrentEditId(null)}
                      />
                    </div>
                  </div>
                )}

                {currentDeleteId === item._id && (
                  <div className={styles.delete}>
                    <h2>Are you sure you want to delete this item?</h2>
                    <p>
                      <span>name</span>: {item.name}
                    </p>
                    <p>
                      <span>URL</span>: {item.URL}
                    </p>
                    {deletedError ? <div className={styles.error}>Error!</div> : null}
                    <div className={styles.buttonarea}>
                      <input
                        className={`${styles.button} ${styles.warning}`}
                        value="Delete"
                        type="button"
                        onClick={() => deleteQr(item._id)}
                      />
                      <input
                        className={styles.button}
                        value="Cancel"
                        type="button"
                        onClick={() => setCurrentDeleteId(null)}
                      />
                    </div>
                  </div>
                )}
              </div>
            ))}
            {!qrs.length ? <>No qrs found</> : null}
          </div>
        </section>

        <footer>
          <p>Create, Read, Update, Delete QR Redirects</p>
        </footer>
      </div>
    </>
  );
}
