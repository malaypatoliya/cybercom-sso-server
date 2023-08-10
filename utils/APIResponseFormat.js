class APIResponseFormat {
    constructor(status, success, message, data, error) {
        this.status = status;
        this.success = success;
        this.message = message;
        this.data = data;
        this.error = error;
    }
}

const _ResMissingRequiredField = (res, message) => {
    res.status(400).json(new APIResponseFormat(400, false, message));
}

const _ResServerError = (res, err) => {
    res.status(500).json(new APIResponseFormat(500, false, "Internal server error", null, err));
}

const _ResInvalidCredentials = (res) => {
    res.status(401).json(new APIResponseFormat(401, false, "Invalid credentials"));
}

const _ResDataNotFound = (res, message) => {
    res.status(404).json(new APIResponseFormat(404, false, message));
}

const _ResDataFound = (res, message, data) => {
    res.status(200).json(new APIResponseFormat(200, true, message, data));
}

const _ResDataCreated = (res, message, data) => {
    res.status(201).json(new APIResponseFormat(201, true, message, data));
}

const _ResDataUpdated = (res, message) => {
    res.status(200).json(new APIResponseFormat(200, true, message));
}

const _ResDataDeleted = (res, message) => {
    res.status(200).json(new APIResponseFormat(200, true, message));
}

const _ResDataNotDeleted = (res, message) => {
    res.status(400).json(new APIResponseFormat(400, false, message));
}

const _ResDataNotUpdated = (res, message) => {
    res.status(400).json(new APIResponseFormat(400, false, message));
}

const _ResDataNotCreated = (res, message) => {
    res.status(400).json(new APIResponseFormat(400, false, message));
}

const _ResDataAlreadyExists = (res) => {
    res.status(400).json(new APIResponseFormat(400, false, "Data already exists"));
}

const _ResDataNotExists = (res, message) => {
    res.status(400).json(new APIResponseFormat(400, false, message));
}


const _ResDuplicateEntry = (res, message) => {
    res.status(400).json(new APIResponseFormat(400, false, message));
}

const _ResUnauthorized = (res, message) => {
    res.status(401).json(new APIResponseFormat(401, false, message));
}

const _ResImageError = (res, message) => {
    res.status(400).json(new APIResponseFormat(400, false, message));
}

const _ResUserVerifed = (res, message) => {
    res.status(200).json(new APIResponseFormat(200, false, message));
}

const _ResError = (res, message) => {
    res.status(400).json(new APIResponseFormat(400, false, message));
}

const _ResNoRecordFound = (res, message) => {
    res.status(404).json(new APIResponseFormat(404, false, "No Record(s) Found", []));
}

module.exports = {
    _ResMissingRequiredField,
    _ResServerError,
    _ResInvalidCredentials,
    _ResDataNotFound,
    _ResDataFound,
    _ResDataCreated,
    _ResDataUpdated,
    _ResDataAlreadyExists,
    _ResDataNotExists,
    _ResDataDeleted,
    _ResDataNotDeleted,
    _ResDataNotUpdated,
    _ResDataNotCreated,
    _ResDuplicateEntry,
    _ResUnauthorized,
    _ResImageError,
    _ResUserVerifed,
    _ResDataNotExists,
    _ResError,
    _ResNoRecordFound
}