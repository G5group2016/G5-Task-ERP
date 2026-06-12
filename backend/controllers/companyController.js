const Company = require("../models/Company");

exports.createCompany = async (req, res) => {
  try {
    const existingCompany = await Company.findOne({
      $or: [
        { name: req.body.name },
        { code: req.body.code }
      ]
    });

    if (existingCompany) {

      // If company is disabled, reactivate it
      if (existingCompany.isActive === false) {

        existingCompany.name = req.body.name;
        existingCompany.code = req.body.code;
        existingCompany.email = req.body.email;
        existingCompany.phone = req.body.phone;
        existingCompany.address = req.body.address;
        existingCompany.isActive = true;

        await existingCompany.save();

        return res.status(200).json({
          success: true,
          company: existingCompany,
          message: "Company reactivated successfully"
        });
      }

      return res.status(400).json({
        success: false,
        message:
          "Company name or code already exists"
      });
    }

    const company = await Company.create({
      ...req.body,
      createdBy: req.user.id
    });

    res.status(201).json({
      success: true,
      company
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message
    });

  }
};


exports.getCompanies = async (
  req,
  res
) => {
  try {
    const companies =
      await Company.find({
        isActive: {
          $ne: false
        }
      })
        .populate(
          "createdBy",
          "fullName email"
        )
        .sort({ createdAt: -1 });

    res.json({
      success: true,
      companies
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};


exports.getCompany = async (
  req,
  res
) => {
  try {
    const company =
      await Company.findById(
        req.params.id
      );

    if (!company) {
      return res.status(404).json({
        message:
          "Company not found"
      });
    }

    res.json(company);
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};


exports.updateCompany = async (
  req,
  res
) => {
  try {
    const company =
      await Company.findByIdAndUpdate(
        req.params.id,
        req.body,
        {
          new: true
        }
      );

    res.json(company);
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};


exports.deleteCompany = async (
  req,
  res
) => {
  try {
    await Company.findByIdAndUpdate(
      req.params.id,
      {
        isActive: false
      }
    );

    res.json({
      message:
        "Company disabled"
    });
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};