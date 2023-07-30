const invalidCharacterRegex = /[-()\s]/g

exports.validatePhoneNumber = (phoneNumber) => {
  return phoneNumber.replaceAll(invalidCharacterRegex, "")
}