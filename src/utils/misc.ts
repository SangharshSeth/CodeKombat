const getInitials = (name: string) => {
    return name
        .split(" ")
        .map((word) => word[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);
};

const getCurrentTime = () => {
    return new Date().toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "numeric",
        hour12: true,
    });
};

export {
    getInitials,
    getCurrentTime,
}