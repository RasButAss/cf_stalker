async function getsums(handle, a, b) {
  const data = await fetch('https://codeforces.com/api/user.status?handle=' + handle);
  const result_data = await data.json();
  const result = result_data.result;
  const want = result.filter((element) => {
    if((element.problem.rating >= a) && (element.problem.rating <= b)) {
      if(element.verdict === 'OK') {
        return true;
      }
    }
  })
  console.log(want);
}
getsums('mridulr2003', 1400, 1400);