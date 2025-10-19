// Customize your access password here 👇
const ACCESS_KEY = "ECHO";

function unlock() {
  const input = document.getElementById("password").value.trim();
  if (input === ACCESS_KEY) {
    document.getElementById("lockscreen").style.display = "none";
    document.getElementById("vault").style.display = "block";
  } else {
    alert("❌ Wrong Password. Access Denied!");
  }
}