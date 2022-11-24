import mail from "@sendgrid/mail";
import twilio from "twilio";
import { NextApiRequest, NextApiResponse } from "next";
import withHandler, { ResponseType } from "@libs/server/withHandler";
import client from "@libs/server/client";
import { LocalPage } from "twilio/lib/rest/api/v2010/account/incomingPhoneNumber/local";

mail.setApiKey(process.env.SENDGRID_KEY!);
const twilioClient = twilio(process.env.TWILIO_SID, process.env.TWILIO_TOKEN);

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>
) {
  const { phone, email } = req.body;
  const user = phone ? { phone } : email ? { email } : null;
  console.log("user : ", user);

  if (!user) return res.status(400).json({ ok: false });
  const payload = Math.floor(100000 + Math.random() * 900000) + "";

  if (phone) {
    const checkPhone = Boolean(
      await client.user.findUnique({
        where: {
          phone: user.phone,
        },
      })
    );
    if (!checkPhone) {
      return res.json({
        ok: false,
        error: "가입되지 않은 핸드폰입니다.",
      });
    }
    // const message = await twilioClient.messages.create({
    //   messagingServiceSid: process.env.TWILIO_MSID,
    //   to: process.env.MY_PHONE!,
    //   body: `Your login token is ${payload}.`,
    // });
    // console.log(message);
  } else if (email) {
    const checkEmail = Boolean(
      await client.user.findUnique({
        //현재 user id
        where: {
          email: user.email,
        },
      })
    );
    if (!checkEmail) {
      return res.json({
        ok: false,
        error: "가입되지 않은 이메일입니다.",
      });
    }
    // const email = await mail.send({
    //   from: "nico@nomadcoders.co",
    //   to: "nico@nomadcoders.co",
    //   subject: "Your Carrot Market Verification Email",
    //   text: `Your token is ${payload}`,
    //   html: `<strong>Your token is ${payload}</strong>`,
    // });
    // console.log(email);
  }
  const token = await client.token.create({
    data: {
      payload,
      user: {
        connect: {
          ...user,
        },
        // connectOrCreate: {
        //   where: {
        //     ...user,
        //   },
        //   create: {
        //     name: "Anonymous",
        //     ...user,
        //   },
        // },
      },
    },
  });
  return res.json({
    ok: true,
    token,
  });
}

export default withHandler({ methods: ["POST"], handler, isPrivate: false });
