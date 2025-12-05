import threading
import time
import random
import queue
import os

def write_log(writer, message):
    if os.path.exists("RG_access_logs.txt"):
        with open("RG_access_logs.txt", 'a') as fichier:
            fichier.write(writer+": "+message)
    else:
        with open("RG_access_logs.txt", 'w') as fichier:
            fichier.write(writer+": "+message)

# Une file utilisée pour passer "l'information" inutilement entre les threads
q1 = queue.Queue()
q1_end = queue.Queue()
q2 = queue.Queue()
q2_end = queue.Queue()
q3 = queue.Queue()
q3_end = queue.Queue()

def thread_init():
    q2_list = [random.randint(0, 125) for i in range(15)]
    q1.put({"user_type" : "user", "user_permissions": "user", "reach": "localhost"})
    q2.put(q2_list)
    q3.put("on s'en fout ça changera rien")

def thread_1():
    #server verification thread
    server_request = q1.get()
    
    hostname = server_request["reach"]
    response = os.system("ping -n 1 " + hostname)

    if response == 0:
        #localhost is up
        write_log("Server Intergrity Thread", "Server is up, move on with procedure")
        if server_request["user_type"] == "user":
            write_log("Server Intergrity Thread", "User is user type, move on with procedure")
            if server_request["user_permissions"] == "user":
                write_log("Server Intergrity Thread", "User permissions are those of a user, procede to next Thread")
                q1_end.put(1)
            else:
                pass
        else:
            pass
    else:
        #localhost is down
        q1_end.put(0)

    #ping localhost | user is user | user has user permisions
    

def thread_2():
    #enemy spy detection thread
    
    n = q2.get()
    password = "".join([chr(i) for i in n])
    write_log("Ennemy Spy Detection Thread", "User inner thought decrypted, please confirm if user is spy")
    if password != "Windows is best":
        q2_end.put(1)
        write_log("Ennemy Spy Detection Thread", "User is not a spy confirmed, move on with procedure")
    else:
        q2_end.put(0)
        write_log("Ennemy Spy Detection Thread", "Ennemy spy detected ! Terminate connection Immediatly !")
    

def thread_3():
   
    n = q3.get()
    write_log("Final Access Thread (the moody one)", "Do i give you access ? let me think for 5 sec")
    time.sleep(5)
    luck_access = random.randint(0,1)
    if luck_access:
        write_log("Final Access Thread (the moody one)", "Access Granted, Finish procedure")
        q3_end.put(1)
    else:
        write_log("Final Access Thread (the moody one)", "Access Denied, Finish procedure")
        q3_end.put(0)
   

def thread_final():
    n1 = q1_end.get()
    n2 = q2_end.get()
    n3 = q3_end.get()
    write_log("System","Assembling all access and procedure confirmations...")
    time.sleep(2)

    if n1+n2+n3 == 3:
        write_log("System","Error 404 : Destination not Found (Try contacting support if the issue subsists)")  # Le but final, incroyablement simple comparé au processus
    else:
        write_log("System","Error 404 : Destination not Found (Try contacting support if the issue subsists)")  # Le but final, incroyablement simple comparé au processus


# On crée les threads
init_t = threading.Thread(target=thread_init)
t1 = threading.Thread(target=thread_1)
t2 = threading.Thread(target=thread_2)
t3 = threading.Thread(target=thread_3)
tf = threading.Thread(target=thread_final)

# On les lance dans n’importe quel ordre (ils se synchronisent via les queues)
init_t.start()
t1.start()
t2.start()
t3.start()
tf.start()

# On attend la fin de tous les threads
init_t.join()
t1.join()
t2.join()
t3.join()
tf.join()