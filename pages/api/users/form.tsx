import mail from "@sendgrid/mail";
import twilio from "twilio";
import { NextApiRequest, NextApiResponse } from "next";
import withHandler, { ResponseType } from "@libs/server/withHandler";
import client from "@libs/server/client";

mail.setApiKey(process.env.SENDGRID_KEY!);

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>
) {
  const { phone, email, username, address } = req.body;
  // const user = phone ? { phone } : email ? { email } : null;
  // if (!user) return res.status(400).json({ ok: false });
  console.log(phone, email, username, address);

  const checkPhone = Boolean(
    await client.user.findUnique({
      where: {
        phone,
      },
    })
  );
  const checkEmail = Boolean(
    await client.user.findUnique({
      //현재 user id
      where: {
        email,
      },
    })
  );
  if (checkEmail) {
    return res.json({
      ok: false,
      error: "이미 가입한 이메일입니다.",
    });
  }
  if (checkPhone) {
    return res.json({
      ok: false,
      error: "이미 가입한 핸드폰번호입니다.",
    });
  }
  const form = await client.user.create({
    data: {
      phone,
      email,
      name: username,
    },
  });

  return res.json({
    ok: true,
    form,
  });
}

export default withHandler({ methods: ["POST"], handler, isPrivate: false });
