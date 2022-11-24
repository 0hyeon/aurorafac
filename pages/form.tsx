import Layout from "@components/layout";
import { FieldErrors, useForm } from "react-hook-form";
import Button from "@components/button";
import Input from "@components/input";
import useMutation from "@libs/client/useMutation";
import { User } from "@prisma/client";
import loadConfig from "next/dist/server/config";
import { log } from "console";
import { useEffect } from "react";
import { useRouter } from "next/router";

interface LoginForm {
  username: string;
  phone: string;
  email: string;
  errors?: string;
}
interface ResponseForm {
  ok: boolean;
  form?: User;
  error?: string;
}
export default function Forms() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setError,
    setValue,
    reset,
    resetField,
  } = useForm<LoginForm>({
    mode: "onChange",
  });
  const [form, { loading, data, error }] =
    useMutation<ResponseForm>("/api/users/form");

  const router = useRouter();
  const onValid = (data: LoginForm) => {
    if (loading) return;
    form(data);
  };
  const onInvalid = (errors: FieldErrors) => {
    console.log("errors : ", errors);
  };
  // setValue("username", "hello"); //초기값 세팅

  useEffect(() => {
    if (data && data.error == "이미 가입한 핸드폰번호입니다.") {
      setError("phone", { message: "이미 가입한 핸드폰번호입니다." });
    }
    if (data && data.error == "이미 가입한 이메일입니다.") {
      setError("email", { message: "이미 가입한 이메일입니다." });
    }
    if (data && data.ok == true) {
      alert("회원가입완료");
      router.replace("/enter");
    }
  }, [data]);
  return (
    <Layout>
      <div className="absolute top-[45%] left-[50%] w-full max-w-3xl translate-y-[-50%] translate-x-[-50%] px-4">
        <h3 className="text-center text-2xl font-normal">회원가입</h3>
        <h5 className="m-12 text-center text-sm font-medium text-gray-500">
          Join us:D
        </h5>
        <form onSubmit={handleSubmit(onValid, onInvalid)}>
          <Input
            register={register("username", {
              required: "아이디는 필수 입력입니다.",
              minLength: {
                message: "아이디는 5글자보다 이상입니다.",
                value: 5,
              },
            })}
            type="text"
            required
            label="아이디"
            name="username"
            // placeholder="오로라팩"
            placeholder="아이디"
          />
          {errors.username?.message ? (
            <div className="text-orange-500">{errors.username?.message}</div>
          ) : null}
          {/* 존재하는 이름입니다. 메시지출력 */}
          <Input
            register={register("email", {
              required: "이메일은 필수 입력입니다.",
              // validate: {
              //   notGmail: (value) => !value.includes(".com") || "@는 필수입니다.",
              // },
            })}
            type="email"
            required
            label="이메일주소"
            name="email"
            placeholder="ex)aurorafac@naver.com"
          />
          {errors.email?.message ? (
            <div className="text-orange-500">{errors.email?.message}</div>
          ) : null}
          <Input
            register={register("phone", {
              required: "핸드폰번호는 필수 입력입니다.",
              minLength: {
                message: "핸드폰번호는 11글자 이상입니다.",
                value: 11,
              },
            })}
            type="number"
            required
            label="핸드폰번호"
            name="phone"
            placeholder="01012345678"
          />
          {errors.phone?.message ? (
            <div className="text-orange-500">{errors.phone?.message}</div>
          ) : null}
          <div className="p-4"></div>
          <Button type="submit" text="회원가입" large={true} />
        </form>
      </div>
    </Layout>
  );
}
