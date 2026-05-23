async function run() {
  try {
    const res = await fetch("http://localhost:7860/api/health-check-xyz-9912");
    console.log("health:", await res.text());
    const res2 = await fetch("http://localhost:7860/test/user?username=BiGwin_93");
    console.log("test user:", await res2.text());
  } catch(e) {
    console.log("error", e);
  }
}
run();
