import React, { useEffect, useState } from "react";
import DaumPostcode from "react-daum-postcode";

const Post = (props: any) => {
  const setAddress = props.setAddress;
  const setZonecode = props.setZonecode;
  const onCompletePost = (data: any) => {
    setAddress(data.address);
    setZonecode(data.zonecode);
  };

  // const [detail, setDetail] = useState("");
  // const onChange = (e: any) => {
  //   setDetail(e.target.value);
  // };
  return (
    <>
      <div>
        <DaumPostcode
          style={{
            display: "block",
            position: "absolute",
            top: "20%",
            width: "400px",
            height: "400px",
            padding: "7px",
            zIndex: 100,
          }}
          autoClose
          onComplete={onCompletePost}
        />
        {/* <input type="text" placeholder="주소" value={address} /> */}
        {/* <input
          type="text"
          placeholder="상세주소"
          onChange={onChange}
          value={detail}
        /> */}
      </div>
    </>
  );
};

export default Post;
