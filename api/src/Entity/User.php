<?php

namespace App\Entity;

use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;
use Symfony\Component\Validator\Constraints as Assert;

/**
 * @ORM\Entity()
 */
class User
{
    /**
     * @ORM\Id
     * @ORM\GeneratedValue
     * @ORM\Column(type="integer")
     * @Groups({"user", "roster"})
     */
    private $id;

    /**
     * @ORM\Column(type="integer")
     * @Groups({"user", "roster"})
     * @Assert\Positive(message="Vous devez entrer un entier positif.")
     * @Assert\NotBlank(message="Ce champ doit contenir une valeur.")
     * @Assert\Type(type="integer", message="La valeur {{ value }} n'est pas de type {{ type }}.")
     */
    private $position;

    /**
     * @ORM\Column(type="string", length=30, unique=true)
     * @Assert\NotBlank(message="Ce champ doit contenir une valeur.")
     * @Assert\Type(type="string", message="La valeur {{ value }} n'est pas de type {{ type }}.")
     * @Assert\Length(
     *      min = 2,
     *      max = 30,
     *      minMessage = "Ce champ doit contenir au moins {{ limit }} caractères.",
     *      maxMessage = "Ce champ ne peut pas contenir plus de {{ limit }} caractères."
     * )
     * @Groups({"user", "roster"})
     */
    private $username;

    /**
     * @ORM\Column(type="string", length=32, unique=true)
     * @Assert\NotBlank(message="Ce champ doit contenir une valeur.")
     * @Assert\Type(type="string", message="La valeur {{ value }} n'est pas de type {{ type }}.")
     * @Assert\Length(
     *      min = 32,
     *      max = 32,
     *      exactMessage = "Ce champ doit contenir exactement {{ limit }} caractères."
     * )
     * @Groups("connectedUser")
     */
    private $token;

    /**
     * @ORM\Column(type="string", length=255, nullable=true)
     * @Assert\Type(type="string", message="La valeur {{ value }} n'est pas de type {{ type }}.")
     * @Assert\Length(
     *      min = 6,
     *      max = 255,
     *      minMessage = "Ce champ doit contenir au moins {{ limit }} caractères.",
     *      maxMessage = "Ce champ ne peut pas contenir plus de {{ limit }} caractères."
     * )
     */
    private $password;

    /**
     * @ORM\Column(type="string", length=32, nullable=true)
     * @Assert\Type(type="string", message="La valeur {{ value }} n'est pas de type {{ type }}.")
     * @Assert\Length(
     *      min = 32,
     *      max = 32,
     *      exactMessage = "Ce champ doit contenir exactement {{ limit }} caractères."
     * )
     */
    private $passwordToken;

    /**
     * @ORM\Column(type="string", length=30, nullable=true)
     * @Assert\Type(type="string", message="La valeur {{ value }} n'est pas de type {{ type }}.")
     * @Assert\Length(
     *      min = 2,
     *      max = 30,
     *      minMessage = "Ce champ doit contenir au moins {{ limit }} caractères.",
     *      maxMessage = "Ce champ ne peut pas contenir plus de {{ limit }} caractères."
     * )
     * @Groups("user")
     */
    private $firstname;

    /**
     * @ORM\Column(type="string", length=30, nullable=true)
     * @Assert\Type(type="string", message="La valeur {{ value }} n'est pas de type {{ type }}.")
     * @Assert\Length(
     *      min = 2,
     *      max = 30,
     *      minMessage = "Ce champ doit contenir au moins {{ limit }} caractères.",
     *      maxMessage = "Ce champ ne peut pas contenir plus de {{ limit }} caractères."
     * )
     * @Groups("user")
     */
    private $lastname;

    /**
     * @ORM\Column(type="string", length=255, unique=true)
     * @Assert\NotBlank(message="Ce champ doit contenir une valeur.")
     * @Assert\Type(type="string", message="La valeur {{ value }} n'est pas de type {{ type }}.")
     * @Assert\Email(message="Adresse email non valide.")
     * @Assert\Length(
     *      min = 6,
     *      max = 255,
     *      minMessage = "Ce champ doit contenir au moins {{ limit }} caractères.",
     *      maxMessage = "Ce champ ne peut pas contenir plus de {{ limit }} caractères."
     * )
     * @Groups("user")
     */
    private $email;

    /**
     * @ORM\Column(type="bigint", nullable=true)
     * @Assert\Length(
     *      min = 11,
     *      minMessage = "Ce champ doit contenir au moins {{ limit }} caractères."
     * )
     * @Groups("user")
     */
    private $birthdate;

    /**
     * @ORM\Column(type="string", length=30, nullable=true)
     * @Assert\Type(type="string", message="La valeur {{ value }} n'est pas de type {{ type }}.")
     * @Assert\Length(
     *      min = 2,
     *      max = 30,
     *      minMessage = "Ce champ doit contenir au moins {{ limit }} caractères.",
     *      maxMessage = "Ce champ ne peut pas contenir plus de {{ limit }} caractères."
     * )
     * @Groups({"user", "roster"})
     */
    private $gamertag;

    /**
     * @ORM\Column(type="string", length=30, nullable=true)
     * @Assert\Type(type="string", message="La valeur {{ value }} n'est pas de type {{ type }}.")
     * @Assert\Length(
     *      min = 2,
     *      max = 30,
     *      minMessage = "Ce champ doit contenir au moins {{ limit }} caractères.",
     *      maxMessage = "Ce champ ne peut pas contenir plus de {{ limit }} caractères."
     * )
     * @Groups({"user", "roster"})
     */
    private $psn;

    /**
     * @ORM\Column(type="string", length=2, nullable=true)
     * @Assert\Type(type="string", message="La valeur {{ value }} n'est pas de type {{ type }}.")
     * @Assert\Length(
     *      min = 2,
     *      max = 30,
     *      minMessage = "Ce champ doit contenir au moins {{ limit }} caractères.",
     *      maxMessage = "Ce champ ne peut pas contenir plus de {{ limit }} caractères."
     * )
     * @Groups({"user", "roster"})
     */
    private $steam;

    /**
     * @ORM\Column(type="string", length=255, nullable=true)
     * @Assert\Type(type="string", message="La valeur {{ value }} n'est pas de type {{ type }}.")
     * @Assert\Url(message="Url non valide.")
     * @Assert\Length(
     *      min = 4,
     *      max = 255,
     *      minMessage = "Ce champ doit contenir au moins {{ limit }} caractères.",
     *      maxMessage = "Ce champ ne peut pas contenir plus de {{ limit }} caractères."
     * )
     * @Groups({"user", "roster"})
     */
    private $twitter;

    /**
     * @ORM\Column(type="string", length=255, nullable=true)
     * @Assert\Type(type="string", message="La valeur {{ value }} n'est pas de type {{ type }}.")
     * @Assert\Url(message="Url non valide.")
     * @Assert\Length(
     *      min = 4,
     *      max = 255,
     *      minMessage = "Ce champ doit contenir au moins {{ limit }} caractères.",
     *      maxMessage = "Ce champ ne peut pas contenir plus de {{ limit }} caractères."
     * )
     * @Groups({"user", "roster"})
     */
    private $facebook;

    /**
     * @ORM\Column(type="boolean")
     * @Assert\NotNull(message="Ce champ doit contenir une valeur.")
     * @Assert\Type(type="bool", message="La valeur {{ value }} n'est pas de type {{ type }}.")
     * @Groups("user")
     */
    private $subscription;

    /**
     * @ORM\Column(type="string", length=255, nullable=true)
     * @Assert\Type(type="string", message="La valeur {{ value }} n'est pas de type {{ type }}.")
     * @Assert\Length(
     *      min = 4,
     *      max = 255,
     *      minMessage = "Ce champ doit contenir au moins {{ limit }} caractères.",
     *      maxMessage = "Ce champ ne peut pas contenir plus de {{ limit }} caractères."
     * )
     * @Groups({"user", "roster"})
     */
    private $picture;

    /**
     * @ORM\ManyToMany(targetEntity="Role", inversedBy="users")
     * @Groups("user")
     */
    private $roles;

    /**
     * @ORM\ManyToMany(targetEntity="Roster", inversedBy="users")
     * @Groups("user")
     */
    private $rosters;

    public function __construct()
    {
        $this->roles = new ArrayCollection();
        $this->rosters = new ArrayCollection();
        $this->subscription = false;
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getUsername(): ?string
    {
        return $this->username;
    }

    public function setUsername(string $username): self
    {
        $this->username = $username;

        return $this;
    }

    public function getEmail(): ?string
    {
        return $this->email;
    }

    public function setEmail(string $email): self
    {
        $this->email = $email;

        return $this;
    }

    public function getPosition(): ?int
    {
        return $this->position;
    }

    public function setPosition(int $position): self
    {
        $this->position = $position;

        return $this;
    }

    public function getPassword(): ?string
    {
        return $this->password;
    }

    public function setPassword(?string $password): self
    {
        $this->password = $password;

        return $this;
    }

    public function getToken(): ?string
    {
        return $this->token;
    }

    public function setToken(string $token): self
    {
        $this->token = $token;

        return $this;
    }

    public function getSubscription(): ?bool
    {
        return $this->subscription;
    }

    public function setSubscription(bool $subscription): self
    {
        $this->subscription = $subscription;

        return $this;
    }

    public function getFirstname(): ?string
    {
        return $this->firstname;
    }

    public function setFirstname(?string $firstname): self
    {
        $this->firstname = $firstname;

        return $this;
    }

    public function getLastname(): ?string
    {
        return $this->lastname;
    }

    public function setLastname(?string $lastname): self
    {
        $this->lastname = $lastname;

        return $this;
    }

    public function getPicture(): ?string
    {
        return $this->picture;
    }

    public function setPicture(?string $picture): self
    {
        $this->picture = $picture;

        return $this;
    }

    public function getGamertag(): ?string
    {
        return $this->gamertag;
    }

    public function setGamertag(?string $gamertag): self
    {
        $this->gamertag = $gamertag;

        return $this;
    }

    public function getPsn(): ?string
    {
        return $this->psn;
    }

    public function setPsn(?string $psn): self
    {
        $this->psn = $psn;

        return $this;
    }

    public function getSteam(): ?string
    {
        return $this->steam;
    }

    public function setSteam(?string $steam): self
    {
        $this->steam = $steam;

        return $this;
    }

    public function getTwitter(): ?string
    {
        return $this->twitter;
    }

    public function setTwitter(?string $twitter): self
    {
        $this->twitter = $twitter;

        return $this;
    }

    public function getFacebook(): ?string
    {
        return $this->facebook;
    }

    public function setFacebook(?string $facebook): self
    {
        $this->facebook = $facebook;

        return $this;
    }

    /**
     * @return Collection|Role[]
     */
    public function getRoles(): Collection
    {
        return $this->roles;
    }

    public function cleanRoles(): self
    {
        $this->roles = new ArrayCollection();

        return $this;
    }

    public function addRole(Role $role): self
    {
        if (!$this->roles->contains($role)) {
            $this->roles[] = $role;
        }

        return $this;
    }

    public function removeRole(Role $role): self
    {
        $this->roles->removeElement($role);

        return $this;
    }

    /**
     * @return Collection|Roster[]
     */
    public function getRosters(): Collection
    {
        return $this->rosters;
    }

    public function addRoster(Roster $roster): self
    {
        if (!$this->rosters->contains($roster)) {
            $this->rosters[] = $roster;
        }

        return $this;
    }

    public function removeRoster(Roster $roster): self
    {
        $this->rosters->removeElement($roster);

        return $this;
    }

    public function getBirthdate(): ?int
    {
        return $this->birthdate;
    }

    public function setBirthdate(?int $birthdate): self
    {
        $this->birthdate = $birthdate;

        return $this;
    }

    public function getPasswordToken(): ?string
    {
        return $this->passwordToken;
    }

    public function setPasswordToken(?string $passwordToken): self
    {
        $this->passwordToken = $passwordToken;

        return $this;
    }
}
