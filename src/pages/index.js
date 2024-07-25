import { useEffect, useState, useRef } from "react";
import { CiTrash } from "react-icons/ci";
import Head from "next/head";
import styles from "@/styles/Home.module.scss";

export default function Home() {
  const qrNameRef = useRef();
  const qrIDToDeleteRef = useRef();
  const qrIDToUpdateRef = useRef();
  const qrNameToUpdateRef = useRef();
  const [qrs, setqrs] = useState([]); // Initialize with an empty array
  const [updated, setUpdated] = useState(false);
  const [updatedError, setUpdatedError] = useState(false);
  const [created, setCreated] = useState(false);
  const [deleted, setDeleted] = useState(false);
  const [deletedError, setDeletedError] = useState(false);

  async function addQr() {
    const qrName = qrNameRef.current.value.trim();
    if (qrName.length < 3) return;
    const postData = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        qr_name: qrName,
      }),
    };
    const res = await fetch("/api/qr", postData);
    const response = await res.json();
    console.log(response)
    if (response.response.message !== "success") return;
    const newqr = response.response.qr;
    setqrs([
      ...qrs,
      {
        qr_id: newqr.qr_id,
        qr_name: newqr.qr_name,
      },
    ]);
    setCreated(true);
  }

  async function getQrs() {
    const postData = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    };
    const res = await fetch("/api/qr", postData);
    const response = await res.json();
    setqrs(response.qrs);
  }

  async function deleteQr(id) {
    if (!id) return;
    const postData = {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        qr_id: id,
      }),
    };
    const res = await fetch("/api/qr", postData);
    const response = await res.json();
    if (response.response.message === "error") return setDeletedError(true);
    setqrs(qrs.filter((a) => a.qr_id !== id));
    setDeleted(true);
  }

  async function updateQr() {
    const qrIDToUpdate = qrIDToUpdateRef.current.value.trim();
    const qrNameToUpdate = qrNameToUpdateRef.current.value.trim();
    if (!qrIDToUpdate.length) return;
    const postData = {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        qr_id: qrIDToUpdate,
        qr_name: qrNameToUpdate,
      }),
    };
    const res = await fetch("/api/qr", postData);
    const response = await res.json();
    if (response.response.message === "error") return setUpdatedError(true);
    const qrIdUpdated = response.response.qr.qr_id;
    const qrUpdatedName = response.response.qr.qr_name;
    const qrsStateAfterUpdate = qrs.map((qr) => {
      if (qr.qr_id === qrIdUpdated) {
        return { ...qr, qr_name: qrUpdatedName };
      }
      return qr;
    });
    setUpdated(true);
    setqrs(qrsStateAfterUpdate);
  }

  useEffect(() => {
    getQrs();
  }, []);

  return (
    <>
      <Head>
        <title>QR Redirect App</title>
      </Head>
      <div className={styles.container}>
        <section className={styles.main}>
          <h1>QR Redirect App</h1>
        </section>
        <section>
          <div className={styles.read}>
            <h2>Read</h2>
            <div className={styles.qrs}>
              {Array.isArray(qrs) && qrs.length > 0 ? (
                qrs.map((item) => (
                  <div key={item.qr_id} className={styles.qr}>
                    <span>qr_id</span>: {item.qr_id} <br /> <span>qr_name</span>: {item.qr_name}{" "}
                    <CiTrash className={styles.icons} onClick={() => deleteQr(item.qr_id)} />
                  </div>
                ))
              ) : (
                <div>No qrs found</div>
              )}
            </div>
          </div>
        </section>
        <section>
          <div className={styles.create}>
            <h2>Create</h2>
            <div className={styles.input}>
              <div className={styles.label}>qr Name</div>
              <input type="text" ref={qrNameRef} />
            </div>
            {created ? <div className={styles.success}>Success!</div> : null}
            <div className={styles.buttonarea}>
              <input className={styles.button} value="Save" type="button" onClick={addQr} />
            </div>
          </div>
        </section>
        <section>
          <div className={styles.update}>
            <h2>Update</h2>
            <div className={styles.input}>
              <div className={styles.label}>qr Id</div>
              <input type="text" ref={qrIDToUpdateRef} />
            </div>
            <div className={styles.input}>
              <div className={styles.label}>qr Name</div>
              <input type="text" ref={qrNameToUpdateRef} />
            </div>
            {updated ? <div className={styles.success}>Success!</div> : null}
            {updatedError ? <div className={styles.error}>Error!</div> : null}
            <div className={styles.buttonarea}>
              <input className={styles.button} value="Update" type="button" onClick={updateQr} />
            </div>
          </div>
        </section>
        <section>
          <div className={styles.delete}>
            <h2>Delete</h2>
            <div className={styles.input}>
              <div className={styles.label}>qr Id</div>
              <input type="text" ref={qrIDToDeleteRef} />
            </div>
            {deleted ? <div className={styles.success}>Success!</div> : null}
            {deletedError ? <div className={styles.error}>Error!</div> : null}
            <div className={styles.buttonarea}>
              <input className={`${styles.button} ${styles.warning}`} value="Delete" type="button" onClick={() => deleteQr(qrIDToDeleteRef.current.value)} />
            </div>
          </div>
        </section>
        <footer>
          <p>Create, Read, Update, Delete QR Redirects</p>
        </footer>
      </div>
    </>
  );
}
