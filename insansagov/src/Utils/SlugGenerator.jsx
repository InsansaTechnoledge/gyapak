const slugGenerator = (title) => {
    return title.
    toLowerCase()
    .replace(/[^\w\s]/g, '')
    .replace(/\s+/g, '-');
}

export default slugGenerator;