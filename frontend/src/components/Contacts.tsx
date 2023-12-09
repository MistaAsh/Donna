// src/components/ContactCard.js
import React, { useMemo, useState } from 'react';
import { createAvatar } from '@dicebear/core';
import { lorelei } from '@dicebear/collection';
import Modal from '@mui/material/Modal';
import Button from '@mui/material/Button';

const Contacts = () => {
    const [contacts, setContacts] = useState(() => {
        const contactsString = window.localStorage.getItem('contacts');
        return contactsString ? JSON.parse(contactsString) : [];
    });

    const handleAddContact = (newContact) => {
        setContacts((prevContacts) => [...prevContacts, newContact]);
    };

    return (
        <div className="flex flex-col items-center w-full">
            <AddContact onAddContact={handleAddContact} />
            <div className="flex flex-col w-full">
                {contacts.map((contact) => (
                    <ContactCard
                        key={contact.walletAddress}
                        name={contact.name}
                        walletAddress={contact.walletAddress}
                    />
                ))}
            </div>
        </div>
    );
}

const AddContact = ({ onAddContact }) => {
    const [isOpen, setIsOpen] = useState(false);

    const onClose = () => setIsOpen(false);

    return (
        <div className="flex flex-col items-center w-full h-10 mb-5">
            <div className="flex flex-col w-full bg-black text-white rounded-md justify-center h-10">
                <button onClick={() => setIsOpen(true)}>
                    Add Contact
                </button>
            </div>
            <ContactModal isOpen={isOpen} onClose={onClose} onAddContact={onAddContact} />
        </div>
    );
};


const ContactModal = ({ isOpen, onClose, onAddContact }) => {
    const [formData, setFormData] = useState({
        name: '',
        walletAddress: '',
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const newContact = formData;
        onAddContact(newContact);

        const contactsString = window.localStorage.getItem('contacts');
        const contacts = contactsString ? JSON.parse(contactsString) : [];
        const newContacts = [...contacts, formData];
        window.localStorage.setItem('contacts', JSON.stringify(newContacts));
        onClose();
        setFormData({
            name: '',
            walletAddress: '',
        })
    };

    return (
        <Modal
            open={isOpen}
            onClose={onClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            <div className="bg-white p-4 rounded-md shadow-md w-96 mx-auto mt-10">
                <h2 className="text-xl font-semibold mb-4">Contact Form</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label htmlFor="name" className="block text-sm font-medium text-gray-600">
                            Name
                        </label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            className="mt-1 p-2 w-full border rounded-md"
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="walletAddress" className="block text-sm font-medium text-gray-600">
                            Wallet Address
                        </label>
                        <input
                            type="text"
                            id="walletAddress"
                            name="walletAddress"
                            value={formData.walletAddress}
                            onChange={handleChange}
                            className="mt-1 p-2 w-full border rounded-md"
                            required
                        />
                    </div>
                    <div className="flex justify-end">
                        <Button type="submit" variant='outlined' className='text-black border-black hover:bg-gray-100'>
                            Submit
                        </Button>
                    </div>
                </form>
            </div>
        </Modal>
    )
}

const ContactCard = ({ name, walletAddress }) => {
    const avatar = useMemo(() => {
        return createAvatar(lorelei, {
            size: 128,
            seed: walletAddress,
        }).toDataUriSync();
    }, []);
    return (
        <div className="w-full px-2 mb-4 flex flex-row items-center gap-6 border-b-2 pb-5 border-b-[#F8F8F8]">
            <div className="flex-shrink-0 mr-4">
                <img src={avatar} alt="Avatar" className="w-10 h-10 text-gray-500" />
            </div>
            <div>
                <p className="text-lg font-semibold">{name}</p>
                <p className="text-gray-500">{walletAddress.slice(0, 2)}...{walletAddress.slice(-2)}</p>
            </div>
        </div>
    );
};

export default Contacts;
