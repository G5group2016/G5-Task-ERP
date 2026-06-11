const Company = require("../models/Company");

exports.createCompany = async (
  req,
  res
) => {
  try {
    const company =
      await Company.create({
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
      await Company.find()
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