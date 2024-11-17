
export const TermsAndConditions = () => {
    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white">
            {/* Main Content */}
            <main className="pt-28 container mx-auto px-6 pb-16">
                <h1 className="text-4xl font-bold text-center mb-10 bg-gradient-to-r from-blue-400 to-purple-500 text-transparent bg-clip-text">
                    Terms and Conditions
                </h1>

                <div className="text-gray-300 space-y-8">
                    <section>
                        <h2 className="text-2xl font-semibold mb-4">1. Introduction</h2>
                        <p>
                            Welcome to CodeDuel! These terms and conditions outline the rules
                            and regulations for using our platform. By accessing or using our
                            services, you agree to be bound by these terms. If you do not
                            agree with any part of the terms, you may not use the platform.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold mb-4">2. User Obligations</h2>
                        <p>
                            As a user of CodeDuel, you agree to:
                        </p>
                        <ul className="list-disc pl-6 space-y-2">
                            <li>
                                Provide accurate and truthful information during registration
                                and while using the platform.
                            </li>
                            <li>
                                Respect other users and refrain from using offensive or
                                inappropriate language.
                            </li>
                            <li>
                                Comply with all applicable laws and regulations.
                            </li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold mb-4">3. Prohibited Activities</h2>
                        <p>
                            Users are prohibited from engaging in activities that:
                        </p>
                        <ul className="list-disc pl-6 space-y-2">
                            <li>
                                Violate the intellectual property rights of CodeDuel or other
                                users.
                            </li>
                            <li>Involve hacking, data theft, or unauthorized access.</li>
                            <li>
                                Disrupt the normal operation of the platform, including
                                overloading servers.
                            </li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold mb-4">4. Limitation of Liability</h2>
                        <p>
                            CodeDuel is not responsible for any loss or damage arising from
                            the use of our platform. All challenges, results, and rankings are
                            offered "as is" without warranties of any kind.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold mb-4">5. Changes to Terms</h2>
                        <p>
                            CodeDuel reserves the right to update or modify these terms at any
                            time. Any changes will be posted on this page with the "Last
                            Updated" date.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold mb-4">6. Contact Us</h2>
                        <p>
                            For any questions or concerns regarding these terms, feel free to
                            contact us at{" "}
                            <a
                                href="mailto:support@codeduel.com"
                                className="text-blue-400 hover:underline"
                            >
                                support@codeduel.com
                            </a>
                            .
                        </p>
                    </section>
                </div>
            </main>

        </div>
    );
};
