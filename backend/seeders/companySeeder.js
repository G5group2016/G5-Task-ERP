const Company =
require("../models/Company");

const companies = [
  {
    name: "G5 Cyber Networks",
    code: "G5CN"
  },
  {
    name: "Eatmark",
    code: "EM"
  },
  {
    name: "G5 Homes",
    code: "G5H"
  },
  {
    name:
      "G5 Infrastructure Developers",
    code: "G5ID"
  },
  {
    name:
      "Smart Holidays",
    code: "SH"
  },
  {
    name:
      "Reminize",
    code: "RM"
  }
];

const seed =
async () => {
  await Company.insertMany(
    companies
  );

  console.log(
    "Companies seeded"
  );

  process.exit();
};

seed();