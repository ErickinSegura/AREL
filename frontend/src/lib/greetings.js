export const greeting = () => {
    const hour = new Date().getHours();
    let greetingBank = [];

    if (hour < 12 && hour >= 6) {
        greetingBank = [
            'Buenos días',
            'Good Morning',
            'Salutations',
            'Need a coffee?',
            'Rise and shine',
            'Morning sunshine',
            'Wakey wakey',
        ];
    }
    else if (hour < 18 && hour >= 12) {
        greetingBank = [
            'Buenas tardes',
            'Good Afternoon',
            'Salutations',
            'Hope you are having a great day',
            'Good day',
            'Afternoon delight',
            'Hope you are having a productive day',
            'Hope you are having a great afternoon',
        ];
    }
    else {
        greetingBank = [
            'Buenas noches',
            'Wow, it is late',
            'Good Evening',
            'Hope you are having a great evening',
            'What are you doing up so late?',
            'Late night thoughts',
            'Hope you are having a productive night',
            "Stayin' up late, huh?",
            'Burning the midnight oil',
            'Night owl vibes',
        ];
    }

    const randomIndex = Math.floor(Math.random() * greetingBank.length);
    return greetingBank[randomIndex];
}