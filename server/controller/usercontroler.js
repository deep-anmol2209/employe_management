import employee from "../model/employeeModel.js"
import admin from "../model/adminModel.js"
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"
import path from "path"
import fs from "fs"
import salary from "../model/salaryModel.js"
import department from "../model/departmentModel.js"
import mongoose from "mongoose"
import { configure } from "../config.js"
import Designation from "../model/designationModel.js"
import { profile } from "console"

const usercontrol = {

    //to create an admin user
    addAdmin: async (req, res) => {
        try {
            const { name, email, password } = req.body;
            if (!name || !email || !password) {
                return res.status(400).json({ msg: "please fill all details" })
            }
            const user = await admin.findOne({ email })
            if (user) return res.status(400).json({ msg: "Email Already Registered" })

            if (password.length < 6)
                return res.status(400).json({ msg: "Password is at least 6 character" })


            const passwordHash = await bcrypt.hash(password, 10)

            const newAdminUser = new admin({
                name, email, password: passwordHash,

            })

            await newAdminUser.save()
            res.status(201).json({ msg: "new admin created" })

        }
        catch (err) {
            console.log(err)
            return res.status(500).json({ msg: "internal server error" })
        }
    },
    //to create a new employe //only Admin


    addEmployee: async (req, res) => {
        try {
            const {
                name,
                email,
                password,
                role = "employee",
                departmentName,
                mobileNo,
                dob,
                address,
                joiningDate = Date.now(),
                bankDetails,
                gender,
                education_details,
                designationId
            } = req.body;

            const file = req.file; // assuming you're using multer middleware
            console.log(req.body);
            console.log(req.file);
            const bankDetailsParsed = typeof bankDetails === 'string' ? JSON.parse(bankDetails) : bankDetails;
            const educationDetailsParsed = typeof education_details === 'string' ? JSON.parse(education_details) : education_details;

            const addressToParsed = typeof address === 'string' ? JSON.parse(address) : address


            if (
                !name || !email || !password || !file || !departmentName || !mobileNo || !addressToParsed || !addressToParsed.city || !addressToParsed.state || !addressToParsed.locality ||
                !joiningDate || !bankDetailsParsed || !bankDetailsParsed.accHolderName ||
                !bankDetailsParsed.accountNo || !bankDetailsParsed.ifscCode || !gender || !dob ||
                !educationDetailsParsed || !educationDetailsParsed.highestQualification ||
                !educationDetailsParsed.universitySchoolname
            ) {
                console.log(req.file);

                return res.status(400).json({ msg: "Invalid data. Please fill all required fields." });
            }

            // Check if department exists
            const departmentDoc = await department.findOne({ name: departmentName });
            if (!departmentDoc) {
                return res.status(404).json({ msg: "Department not found." });
            }

            if (designationId) {
                // Check if designation exists
                const designation = await Designation.findById(designationId);
                if (!designation) {
                    return res.status(404).json({ msg: "Designation not found." });
                }
            }
            // Hash password
            const hashedPassword = await bcrypt.hash(password, 10);

            // Store image path
            const imagePath = `/uploads/${file.filename}`; // Assuming static folder setup

            const newUser = new employee({
                name,
                email,
                password: hashedPassword,
                role,
                photo: imagePath,
                mobileNo,
                address:{
                    city: addressToParsed.city,
                    state: addressToParsed.state,
                    locality: addressToParsed.locality
                },
                gender,
                dob,
                bankDetails: bankDetailsParsed,
                joiningDate,
                departmentId: departmentDoc._id,
                designationId : designationId || null,
                profilePicture: imagePath,
                education_details: {
                    highestQualification: educationDetailsParsed.highestQualification,
                    universitySchoolname: educationDetailsParsed.universitySchoolname
                }
            });


            // Save employee
            await newUser.save();

            // Update references
            await department.findByIdAndUpdate(
                departmentDoc._id,
                { $push: { employees: newUser._id } },
                { new: true }
            );
 if(designationId){
            await Designation.findByIdAndUpdate(
                designationId,
                { $push: { employeeIds: newUser._id } },
                { new: true }
            );
        }
            res.status(201).json({ message: 'Employee created successfully', user: newUser });

        } catch (error) {
            console.error('Error adding employee:', error);
            if (!res.headersSent) {
                res.status(500).json({ error: error.message });
            }
        }
    },


    getEmployeeByIdinParam: async (req, res) => {
        try {
            const { id } = req.params

            if (!id || !mongoose.Types.ObjectId.isValid(id)) {
                return res.status(403).json({ msg: "invali id" })
            }

            const result = await employee.findById(id)
                .select('id name mobileNo email gender joiningDate profilePicture dob address')
                .populate("departmentId", 'name')
                .exec()
            if (!result) {
                return res.status(400).json({ msg: "tere is some error" })
            }
            res.status(200).json({ msg: "founded", result })
        } catch (err) {
            console.log(err)
            return res.status(500).json({ msg: "internal server error" })
        }



    },
    updateEmployeeDetails: async (req, res) => {
        try {
            const { userId } = req.params;
            const {
                name,
                email,
                dob,
                joiningDate,
                gender,
                mobileNo,
                address,
                departmentname
            } = req.body;

            console.log('Payload received in backend:', {
                name,
                email,
                dob,
                joiningDate,
                gender,
                mobileNo,
                address,
                departmentname
            });

            if (!mongoose.Types.ObjectId.isValid(userId)) {
                return res.status(400).json({ msg: "Invalid userId" });
            }

            let updates = {};

            if (name) updates.name = name;
            if (email) updates.email = email;
            if (dob) updates.dob = dob;
            if (joiningDate) updates.joiningDate = joiningDate;
            if (mobileNo) updates.mobileNo = mobileNo;
            if (gender) updates.gender = gender;
            if (address) {
                updates.address = {
                    city: address.city || undefined,
                    state: address.state || undefined,
                    locality: address.locality || undefined,
                    country: address.country || undefined
                };
            }

            let newDepartment = null;
            if (departmentname) {
                newDepartment = await department.findOne({ name: departmentname });
                if (!newDepartment) {
                    console.log('New department not found:', departmentname);
                    return res.status(404).json({ msg: "Department not found" });
                }
                updates.departmentId = newDepartment._id;
            }

            // Retrieve the current user
            const user = await employee.findById(userId);
            if (!user) {
                console.log('User not found with ID:', userId);
                return res.status(404).json({ msg: "User not found" });
            }

            console.log('Fetched user:', user);

            // If a new department is provided, update the user's department
            if (newDepartment) {
                // Remove user from old department if exists
                if (user.departmentId) {
                    console.log('Removing user from old department:', user.departmentId);
                    await department.findByIdAndUpdate(
                        user.departmentId,
                        { $pull: { employees: user._id } }
                    );
                }

                // Add user to new department
                console.log('Adding user to new department:', newDepartment._id);
                await department.findByIdAndUpdate(
                    newDepartment._id,
                    { $push: { employees: user._id } }
                );
            }

            // Update the user document with the new values
            const updatedUser = await employee.findByIdAndUpdate(userId, { $set: updates }, { new: true });
            if (!updatedUser) {
                console.log('Failed to update user with ID:', userId);
                return res.status(404).json({ msg: "User not found" });
            }

            console.log('Updated user:', updatedUser);

            res.status(200).json({ message: 'User updated successfully', user: updatedUser });

        } catch (error) {
            console.error('Error updating user:', error.message);
            res.status(400).json({ error: error.message });
        }
    },



    //to remove the employee // only admin
    deleteEmployee: async (req, res) => {
        try {
            const { id } = req.params; // Assuming the employee ID is passed as a URL parameter

            // Find the employee by ID
            const employeeToDelete = await employee.findById(id);
            if (!employeeToDelete) {
                return res.status(404).json({ msg: "Employee not found" });
            }

            // Delete the profile picture from Cloudinary
            const public_id = employeeToDelete.profilePicture.public_id;
            if (public_id) {
                await cloudinary.uploader.destroy(public_id);
            }

            // Delete the associated salary record
            await salary.findByIdAndDelete(employeeToDelete.salaryId);

            // Remove the employee ID from the department's employee list
            await department.findByIdAndUpdate(
                employeeToDelete.departmentId,
                { $pull: { employees: employeeToDelete._id } }
            );
            await Designation.findByIdAndUpdate(
                employeeToDelete.designationId,
                { $pull: { employeeIds: employeeToDelete._id } }
            )

            // Delete the employee record from the database
            await employee.findByIdAndDelete(id);

            res.status(200).json({ msg: "Employee deleted successfully" });
        } catch (error) {
            console.error('Error deleting employee:', error.message);

            if (!res.headersSent) {
                res.status(500).json({ error: error.message });
            }
        }
    },

    //get all employees along with their salary and department//only admin
    getallemployees: async (req, res) => {
        try {
            const employees = await employee
                .find()
                .select('id name mobileNo email gender joiningDate profilePicture dob address') // Replace with the fields you want to retrieve from employee
                .populate('departmentId', 'name') // Populate departmentId and select only the name field
                .exec();

            if (!employees || employees.length === 0) {
                return res.status(400).json({ msg: "not founded" });
            }

            res.status(200).json({ msg: "founded", employees });
        } catch (err) {
            console.log(err);
            return res.status(500).json({ msg: "internal server error" });
        }
    }
    ,
    getEmployeeById: async (req, res) => {
        try {
            // Extract token from Authorization header
            const userId = req.user.id

            // Fetch user by ID
            const user = await employee.findById(userId).select("-password");
            if (!user) {
                return res.status(404).json({ msg: 'User not found' });
            }

            // Respond with user data
            res.status(200).json({ user });
        } catch (error) {
            console.error('Error fetching employee:', error.message);
            res.status(500).json({ msg: 'Server error', error: error.message });
        }
    },
    getemployeesonly: async (req, res) => {
        try {
            const result = await employee.countDocuments()
            if (!result) {
                return res.status(403).json({ msg: "not found" })
            }
            res.status(200).json({ msg: "founded", result })
        } catch (err) {
            console.log(err)
            return res.status(500).json({ msg: "internal server eroor" })
        }
    },
    getDepartmentEmployees: async (req, res) => {
        try {
            const { depname } = req.params
            if (!depname) {
                return res.status(400).json({ msg: "provide department name" })
            }
            console.log(depname)
            // Find the department by name and populate employees
            const departmentData = await department.findOne({ name: depname }).populate('employees', 'name id',);

            // Check if department exists
            if (!departmentData) {
                return res.status(404).json({ msg: "Department not found" });
            }

            // Respond with the employees of the department
            res.status(200).json({ employees: departmentData.employees });

        } catch (err) {
            console.error("Error fetching department employees:", err);
            res.status(500).json({ msg: "Server error" });
        }
    }
}
export default usercontrol