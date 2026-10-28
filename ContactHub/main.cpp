#include <iostream>
#include "ContactManager.h"
#include <ctime>
#include <limits>
using namespace std;

void displayMenu()
{
    cout << "\n==================================================\n";
    cout << "               CONTACTHUB\n";
    cout << "         Contact Management System\n";
    cout << "==================================================\n";

    cout << "1. Add Contact\n";
    cout << "2. View Contacts\n";
    cout << "3. Search Contact\n";
    cout << "4. Update Contact\n";
    cout << "5. Delete Contact\n";
    cout << "6. Sort Contacts\n";
    cout << "7. Favorite Contacts\n";
    cout << "8. Statistics\n";
    cout << "9. Save Contacts\n";
    cout << "10. Load Contacts\n";
    cout << "11. Exit\n";

    cout << "==================================================\n";
}


string getCurrentDate()
{
    time_t now = time(0);
    tm *ltm = localtime(&now);

    char date[11];

    sprintf(date,
            "%02d-%02d-%04d",
            ltm->tm_mday,
            ltm->tm_mon + 1,
            ltm->tm_year + 1900);

    return string(date);
}


Contact inputContact(ContactManager &manager)
{
    string name, phone, email, address;
    char fav;

    cin.ignore(numeric_limits<streamsize>::max(), '\n');

    // Name
    do
    {
        cout << "\nEnter Name: ";
        getline(cin, name);

        if (name.empty())
            cout << "Name cannot be empty!\n";

    } while (name.empty());

    // Phone
    while (true)
    {
        cout << "Enter Phone: ";
        getline(cin, phone);

        if (!manager.isValidPhone(phone))
        {
            cout << "Invalid phone number!\n";
            continue;
        }

        if (manager.isDuplicatePhone(phone))
        {
            cout << "Phone already exists!\n";
            continue;
        }

        break;
    }

    // Email
    while (true)
    {
        cout << "Enter Email: ";
        getline(cin, email);

        if (!manager.isValidEmail(email))
        {
            cout << "Invalid email!\n";
            continue;
        }

        break;
    }

    cout << "Enter Address: ";
    getline(cin, address);

    cout << "Favorite (Y/N): ";
    cin >> fav;

    return Contact(
        name,
        phone,
        email,
        address,
        fav == 'Y' || fav == 'y',
        getCurrentDate());
}




int main()
{
    ContactManager manager;
    manager.loadFromFile();

    int choice;

    do
    {
        displayMenu();

        cout << "Enter your choice: ";
        cin >> choice;

        switch (choice)
        {
        case 1:
        {
            Contact contact = inputContact(manager);

            manager.addContact(contact);
            

            cout << "\nContact Added Successfully!\n";

            break;
        }

        case 2:

            manager.viewContacts();
            break;

        case 3:
        {
            int searchChoice;
            string input;

            cout << "\n====== SEARCH CONTACT ======\n";
            cout << "1. Search by Name\n";
            cout << "2. Search by Phone\n";
            cout << "3. Search by Email\n";
            cout << "Enter choice: ";
            cin >> searchChoice;

            cin.ignore(numeric_limits<streamsize>::max(), '\n');

            switch (searchChoice)
            {
            case 1:
                cout << "Enter Name: ";
                getline(cin, input);
                manager.searchByName(input);
                break;

            case 2:
                cout << "Enter Phone: ";
                getline(cin, input);
                manager.searchByPhone(input);
                break;

            case 3:
                cout << "Enter Email: ";
                getline(cin, input);
                manager.searchByEmail(input);
                break;

            default:
                cout << "\nInvalid Choice!\n";
            }

            break;
        }

        case 4:
        {
            string oldPhone;

            cin.ignore(numeric_limits<streamsize>::max(), '\n');

            cout << "\nEnter Phone Number of Contact to Update: ";
            getline(cin, oldPhone);

            string name, newPhone, email, address;
            char fav;

            cout << "Enter New Name: ";
            getline(cin, name);

            while (true)
            {
                cout << "Enter New Phone: ";
                getline(cin, newPhone);

                if (!manager.isValidPhone(newPhone))
                {
                    cout << "Invalid Phone Number!\n";
                    continue;
                }

                // Allow keeping the same phone number
                if (newPhone != oldPhone && manager.isDuplicatePhone(newPhone))
                {
                    cout << "Phone Number Already Exists!\n";
                    continue;
                }

                break;
            }

            while (true)
            {
                cout << "Enter New Email: ";
                getline(cin, email);

                if (!manager.isValidEmail(email))
                {
                    cout << "Invalid Email!\n";
                    continue;
                }

                break;
            }

            cout << "Enter New Address: ";
            getline(cin, address);

            cout << "Favorite (Y/N): ";
            cin >> fav;

            Contact updatedContact(
                name,
                newPhone,
                email,
                address,
                (fav == 'Y' || fav == 'y'),
                getCurrentDate());

            if (manager.updateContact(oldPhone, updatedContact))
                cout << "\n✅ Contact Updated Successfully!\n";
            else
                cout << "\n❌ Contact Not Found!\n";

            break;
        }

        case 5:
        {
            string phone;
            char confirm;

            cin.ignore(numeric_limits<streamsize>::max(), '\n');

            cout << "\nEnter Phone Number: ";
            getline(cin, phone);

            cout << "Are you sure? (Y/N): ";
            cin >> confirm;

            if (confirm == 'Y' || confirm == 'y')
            {
                if (manager.deleteContact(phone))
                    cout << "\n✅ Contact Deleted Successfully!\n";
                else
                    cout << "\n❌ Contact Not Found!\n";
            }
            else
            {
                cout << "\nDeletion Cancelled.\n";
            }

            break;
        }

        case 6:
        {
            int sortChoice;

            cout << "\n====== SORT CONTACTS ======\n";
            cout << "1. Sort By Name\n";
            cout << "2. Sort By Phone\n";
            cout << "Enter Choice: ";
            cin >> sortChoice;

            if (sortChoice == 1)
            {
                manager.sortByName();
                manager.saveToFile();
            }
            else if (sortChoice == 2)
            {
                manager.sortByPhone();
                manager.saveToFile();
            }
            else
            {
                cout << "\nInvalid Choice!\n";
            }

            break;
        }

        case 7:
        {
            manager.viewFavoriteContacts();
            break;
        }
        
        case 8:
        {
            manager.showStatistics();
            break;
        }

        case 9:
        {
            manager.saveToFile();
            cout << "\n✅ Contacts Saved Successfully!\n";
            break;
        }

        case 10:
            cout << "\nLoad feature coming soon...\n";
            break;

        case 11:
        {
            manager.saveToFile();

            cout << "\nContacts Saved Successfully!\n";
            cout << "Thank you for using ContactHub!\n";

            break;
        }

        default:
            cout << "\nInvalid Choice! Please try again.\n";
        }

    } while (choice != 11);

    return 0;
}