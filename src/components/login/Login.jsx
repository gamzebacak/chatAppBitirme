import { useState, useEffect } from "react";
import "./login.css";
import { toast } from "react-toastify";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import {
  doc,
  setDoc,
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import { auth, db } from "../../lib/firebase";
import upload from "../../lib/upload";

const Login = () => {
  const [avatar, setAvatar] = useState({
    file: null,
    url: "",
  });

  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null); // Kullanıcı durumunu saklamak için state

  useEffect(() => {
    // Uygulama başladığında localStorage'dan kullanıcı bilgisini al
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleAvatar = (e) => {
    if (e.target.files[0]) {
      setAvatar({
        file: e.target.files[0],
        url: URL.createObjectURL(e.target.files[0]),
      });
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.target);
    const { username, email, password } = Object.fromEntries(formData);

    // GİRİŞLERİ DOĞRULA
    if (!username || !email || !password)
      return toast.warn("Lütfen bilgileri giriniz!");
    if (!avatar.file) return toast.warn("Lütfen bir avatar yükleyin!");

    // KULLANICI ADININ EŞSİZ OLDUĞUNU DOĞRULA
    const usersRef = collection(db, "users");
    const q = query(usersRef, where("username", "==", username));
    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty) {
      setLoading(false);
      return toast.warn("Başka bir kullanıcı adı seçin");
    }

    try {
      const res = await createUserWithEmailAndPassword(auth, email, password);
      const imgUrl = await upload(avatar.file);

      await setDoc(doc(db, "users", res.user.uid), {
        username,
        email,
        avatar: imgUrl,
        id: res.user.uid,
        blocked: [],
      });

      await setDoc(doc(db, "userchats", res.user.uid), {
        chats: [],
      });

      toast.success("Hesap oluşturuldu! Artık giriş yapabilirsiniz!");

      // Kullanıcı bilgisini localStorage'a kaydet
      localStorage.setItem("user", JSON.stringify(res.user));
      setUser(res.user); // Kullanıcıyı state'e ayarla
    } catch (err) {
      console.log(err);
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.target);
    const { email, password } = Object.fromEntries(formData);

    try {
      const res = await signInWithEmailAndPassword(auth, email, password);

      // Kullanıcı bilgisini localStorage'a kaydet
      localStorage.setItem("user", JSON.stringify(res.user));
      setUser(res.user); // Kullanıcıyı state'e ayarla
    } catch (err) {
      console.log(err);
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);

      // Kullanıcı bilgisini localStorage'dan kaldır
      localStorage.removeItem("user");
      setUser(null); // Kullanıcıyı state'ten kaldır
      toast.success("Başarıyla çıkış yaptınız!");
    } catch (err) {
      console.log(err);
      toast.error(err.message);
    }
  };

  return (
    <div className="login">
      {user ? (
        <div className="item">
          <h2>Tekrar hoşgeldiniz,</h2>
          <button onClick={handleLogout}>Çıkış Yap</button>{" "}
        </div>
      ) : (
        <>
          <div className="item">
            <h2>Giriş Yap</h2>
            <form onSubmit={handleLogin}>
              <input type="text" placeholder="Email" name="email" />
              <input type="password" placeholder="Password" name="password" />
              <button disabled={loading}>
                {loading ? "Yükleniyor" : "Giriş Yap"}
              </button>
            </form>
          </div>
          <div className="separator"></div>
          <div className="item">
            <h2>Hesap Oluştur</h2>
            <form onSubmit={handleRegister}>
              <label htmlFor="file">
                <img src={avatar.url || "./avatar.png"} alt="" />
                Bir resim yükleyin
              </label>
              <input
                type="file"
                id="file"
                style={{ display: "none" }}
                onChange={handleAvatar}
              />
              <input type="text" placeholder="Kullanıcı Adı" name="username" />
              <input type="text" placeholder="Email" name="email" />
              <input type="password" placeholder="Şifre" name="password" />
              <button disabled={loading}>
                {loading ? "Yükleniyor" : "Kaydol"}
              </button>
            </form>
          </div>
        </>
      )}
    </div>
  );
};

export default Login;
